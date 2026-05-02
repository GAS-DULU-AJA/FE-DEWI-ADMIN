"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange?: (files: File[]) => void;
  value?: File[];
  className?: string;
  placeholder?: string;
}

function FileUpload({
  accept,
  multiple = false,
  maxSize = 5,
  onChange,
  value = [],
  className,
  placeholder = "Drag & drop files here, or click to browse",
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError(null);
    const files = Array.from(fileList);
    const oversized = files.find((f) => f.size > maxSize * 1024 * 1024);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${maxSize}MB limit`);
      return;
    }
    onChange?.(multiple ? [...value, ...files] : files.slice(0, 1));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/10"
            : "border-surface-container-high bg-surface-container-low hover:border-emerald-400 hover:bg-primary/10/50"
        )}
      >
        <Upload className={cn("h-8 w-8 mb-2", dragActive ? "text-primary" : "text-on-surface/40")} />
        <p className="text-sm text-on-surface/70 text-center">{placeholder}</p>
        <p className="text-xs text-on-surface/40 mt-1">Max {maxSize}MB per file</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 py-2"
            >
              {isImage(file) ? (
                <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-on-surface/60 shrink-0" />
              )}
              <span className="flex-1 truncate text-sm text-on-surface/80">{file.name}</span>
              <span className="text-xs text-on-surface/40 shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="shrink-0 rounded p-1 text-on-surface/40 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
export type { FileUploadProps };
