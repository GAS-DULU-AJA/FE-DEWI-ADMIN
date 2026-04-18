/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const MESSAGES_DIR = path.join(ROOT, "messages");
const LOCALES = ["id", "en", "ja"];

const VALID_KEY = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function flattenMessages(obj, prefix = "", out = new Map()) {
  if (!obj || typeof obj !== "object") return out;

  for (const [key, value] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      const placeholders = [...value.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]);
      out.set(nextKey, placeholders);
    } else if (value && typeof value === "object") {
      flattenMessages(value, nextKey, out);
    }
  }

  return out;
}

function listSourceFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      listSourceFiles(fullPath, out);
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }

  return out;
}

function getTranslatorMappings(content) {
  const mappings = new Map();

  for (const match of content.matchAll(/const\s+(\w+)\s*=\s*useTranslations\(([^)]*)\)/g)) {
    const varName = match[1];
    const rawArg = match[2].trim();

    let namespace = null;
    const stringArg = rawArg.match(/^['\"]([^'\"]+)['\"]$/);
    if (stringArg) namespace = stringArg[1];

    mappings.set(varName, namespace);
  }

  return mappings;
}

function collectTranslationCalls(content, varName) {
  const calls = [];

  const directCallRegex = new RegExp(`${varName}\\(\\s*['\"]([^'\"]+)['\"]\\s*(?:,\\s*(\\{[\\s\\S]*?\\}))?\\s*\\)`, "g");

  for (const match of content.matchAll(directCallRegex)) {
    calls.push({
      key: match[1],
      argsObject: (match[2] || "").trim(),
    });
  }

  return calls;
}

function hasArg(argsObject, name) {
  if (!argsObject) return false;
  return new RegExp(`\\b${name}\\s*:`, "m").test(argsObject);
}

function main() {
  const localeMaps = {};

  for (const locale of LOCALES) {
    const msgPath = path.join(MESSAGES_DIR, `${locale}.json`);
    localeMaps[locale] = flattenMessages(readJson(msgPath));
  }

  const files = listSourceFiles(SRC_DIR);
  const findings = [];

  for (const file of files) {
    const relPath = path.relative(ROOT, file).replace(/\\/g, "/");
    const content = fs.readFileSync(file, "utf8");
    const translators = getTranslatorMappings(content);

    if (translators.size === 0) continue;

    for (const [varName, namespace] of translators.entries()) {
      const calls = collectTranslationCalls(content, varName);

      for (const call of calls) {
        const key = call.key;
        if (key.includes("${")) continue;
        if (!key.includes(".")) continue;

        const fullKey = namespace ? `${namespace}.${key}` : key;

        if (!VALID_KEY.test(fullKey)) continue;

        const missingLocales = LOCALES.filter((locale) => !localeMaps[locale].has(fullKey));
        if (missingLocales.length > 0) {
          findings.push({
            type: "missing_key",
            file: relPath,
            key: fullKey,
            details: `locales=${missingLocales.join(",")}`,
          });
          continue;
        }

        const placeholders = localeMaps.id.get(fullKey) || [];
        if (placeholders.length === 0) continue;

        const missingParams = placeholders.filter((name) => !hasArg(call.argsObject, name));
        if (missingParams.length > 0) {
          findings.push({
            type: "missing_params",
            file: relPath,
            key: fullKey,
            details: `missing=${missingParams.join(",")}`,
          });
        }
      }
    }
  }

  console.log("i18n audit: start");

  if (findings.length === 0) {
    console.log("i18n audit: no issues found");
    process.exit(0);
  }

  for (const finding of findings) {
    console.log(`${finding.type}: ${finding.file} :: ${finding.key} :: ${finding.details}`);
  }

  console.log(`i18n audit: found ${findings.length} issue(s)`);
  process.exit(1);
}

main();
