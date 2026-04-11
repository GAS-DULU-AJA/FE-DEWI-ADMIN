import { EXPERIENCES } from "../mock-data";

export function ExperienceCalendar() {
  const eventDays = new Set(EXPERIENCES.map((item) => new Date(item.startsAt).getDate()));

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1 text-[11px] font-semibold text-stone-400">
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
              className={`rounded-md py-1.5 text-xs ${isEvent ? "bg-emerald-600 font-semibold text-white" : "text-stone-600 hover:bg-stone-100"}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
