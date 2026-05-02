import { EXPERIENCES } from "../mock-data";

export function ExperienceCalendar() {
  const eventDays = new Set(EXPERIENCES.map((item) => new Date(item.startsAt).getDate()));

  return (
    <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-4">
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1 text-[11px] font-semibold text-on-surface/40">
            {d}
          </div>
        ))}
        {[...Array(2)].map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
          const isEvent = eventDays.has(day);
          return (
            <div
              key={day}
              className={`rounded-md py-1.5 text-xs ${isEvent ? "bg-primary font-semibold text-white" : "text-on-surface/70 hover:bg-surface-container"}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
