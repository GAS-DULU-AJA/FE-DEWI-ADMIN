import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TicketType } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function TicketManager({ tickets }: { tickets: TicketType[] }) {
  const t = useTranslations("experience");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.ticketTypes")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-lg border border-surface-container-high p-3 text-sm">
            <p className="font-medium text-on-surface">{ticket.name}</p>
            <p className="text-on-surface/70">{ticket.description}</p>
            <p className="text-on-surface/60">{t("components.price")}: {ticket.price.toLocaleString("id-ID")}</p>
            <p className="text-on-surface/60">{t("components.quota")}: {ticket.sold}/{ticket.quota}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
