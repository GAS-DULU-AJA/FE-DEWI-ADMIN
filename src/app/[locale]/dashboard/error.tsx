"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-stone-900 mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-stone-500 max-w-md mb-6">
        Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau hubungi dukungan
        jika masalah berlanjut.
      </p>
      {error.digest && (
        <p className="text-xs text-stone-400 mb-4 font-mono">
          Error ID: {error.digest}
        </p>
      )}
      <Button onClick={reset} variant="outline">
        <RotateCcw className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
