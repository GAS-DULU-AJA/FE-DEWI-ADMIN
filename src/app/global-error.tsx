"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="bg-stone-50">
        <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
          <div className="rounded-full bg-red-100 p-5 mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Terjadi Kesalahan Sistem</h1>
          <p className="text-sm text-stone-500 max-w-md mb-8">
            Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang
            memperbaiki masalah ini.
          </p>
          {error.digest && (
            <p className="text-xs text-stone-400 mb-4 font-mono">
              Ref: {error.digest}
            </p>
          )}
          <div className="flex gap-3">
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Button asChild>
              <a href="/">
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </a>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
