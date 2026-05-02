import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAYMENT_GATEWAY_RECOMMENDATIONS } from "../constants";

export function PaymentRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Rekomendasi Integrasi Pembayaran Reservasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-on-surface/70">
          Untuk skenario reservasi dengan add-on lintas mitra, gunakan model
          transaksi marketplace dengan split settlement agar dana langsung
          terdistribusi ke setiap mitra yang terlibat.
        </p>
        <div className="space-y-3">
          {PAYMENT_GATEWAY_RECOMMENDATIONS.map((gateway) => (
            <div
              key={gateway.name}
              className="rounded-lg border border-surface-container-high bg-surface-container-low p-3"
            >
              <p className="text-sm font-semibold text-on-surface">{gateway.name}</p>
              <p className="mt-1 text-xs text-on-surface/70">{gateway.reason}</p>
              <p className="mt-2 text-xs font-medium text-on-surface/80">
                Metode pembayaran:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-on-surface/70">
                {gateway.methods.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
