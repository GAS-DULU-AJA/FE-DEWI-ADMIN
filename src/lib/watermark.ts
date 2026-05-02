import type { WatermarkConfig, WatermarkPosition } from "@/types";

const DEFAULT_OPACITY = 0.3;
const DEFAULT_FONT_SIZE = 24;
const DEFAULT_SCALE = 0.2;
const DEFAULT_PADDING = 20;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}

function loadFileImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load file image"));
    };

    image.src = url;
  });
}

function getAnchorPoint(
  position: Exclude<WatermarkPosition, "tiled">,
  canvasWidth: number,
  canvasHeight: number,
  width: number,
  height: number,
  padding: number,
) {
  switch (position) {
    case "center":
      return {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
      };
    case "top-left":
      return { x: padding, y: padding };
    case "top-right":
      return { x: canvasWidth - width - padding, y: padding };
    case "bottom-left":
      return { x: padding, y: canvasHeight - height - padding };
    default:
      return {
        x: canvasWidth - width - padding,
        y: canvasHeight - height - padding,
      };
  }
}

function drawTextWatermark(ctx: CanvasRenderingContext2D, config: WatermarkConfig, canvasWidth: number, canvasHeight: number) {
  const text = config.text?.trim();
  if (!text) return;

  const fontSize = config.fontSize ?? DEFAULT_FONT_SIZE;
  const padding = config.padding ?? DEFAULT_PADDING;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = config.fontColor ?? "#ffffff";

  const textWidth = ctx.measureText(text).width;
  const textHeight = fontSize;

  if (config.position === "tiled") {
    const stepX = Math.max(textWidth + padding * 2, 140);
    const stepY = Math.max(textHeight + padding * 2, 120);
    for (let y = padding + textHeight; y < canvasHeight + stepY; y += stepY) {
      for (let x = padding; x < canvasWidth + stepX; x += stepX) {
        ctx.fillText(text, x, y);
      }
    }
    return;
  }

  const point = getAnchorPoint(config.position, canvasWidth, canvasHeight, textWidth, textHeight, padding);
  ctx.fillText(text, point.x, point.y + textHeight);
}

async function drawImageWatermark(
  ctx: CanvasRenderingContext2D,
  config: WatermarkConfig,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (!config.imageUrl) return;

  const watermarkImage = await loadImage(config.imageUrl);
  const scale = clamp(config.scale ?? DEFAULT_SCALE, 0.05, 1);
  const targetWidth = canvasWidth * scale;
  const ratio = watermarkImage.width / watermarkImage.height;
  const targetHeight = targetWidth / ratio;
  const padding = config.padding ?? DEFAULT_PADDING;

  if (config.position === "tiled") {
    const stepX = targetWidth + padding * 2;
    const stepY = targetHeight + padding * 2;
    for (let y = 0; y < canvasHeight + stepY; y += stepY) {
      for (let x = 0; x < canvasWidth + stepX; x += stepX) {
        ctx.drawImage(watermarkImage, x + padding, y + padding, targetWidth, targetHeight);
      }
    }
    return;
  }

  const point = getAnchorPoint(config.position, canvasWidth, canvasHeight, targetWidth, targetHeight, padding);
  ctx.drawImage(watermarkImage, point.x, point.y, targetWidth, targetHeight);
}

export async function applyWatermark(file: File, config: WatermarkConfig): Promise<File> {
  if (!config.enabled || !file.type.startsWith("image/")) {
    return file;
  }

  const image = await loadFileImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.drawImage(image, 0, 0);
  ctx.save();
  ctx.globalAlpha = clamp(config.opacity ?? DEFAULT_OPACITY, 0, 1);

  if (config.type === "text") {
    drawTextWatermark(ctx, config, canvas.width, canvas.height);
  } else {
    await drawImageWatermark(ctx, config, canvas.width, canvas.height);
  }

  ctx.restore();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.9);
  });

  if (!blob) {
    return file;
  }

  const extension = file.name.includes(".") ? file.name.slice(0, file.name.lastIndexOf(".")) : file.name;
  return new File([blob], `${extension}-wm.jpg`, { type: "image/jpeg" });
}
