import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModulePlaceholderPage({
  title,
  description,
  highlights,
}: {
  title: string;
  description: string;
  highlights: string[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-on-surface/60">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview Modul</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-sm text-on-surface/80"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
