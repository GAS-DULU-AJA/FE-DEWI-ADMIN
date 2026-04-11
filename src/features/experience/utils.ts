import {
  EXPERIENCE_COORDINATIONS,
  EXPERIENCE_PROMOTIONS,
  EXPERIENCE_RESERVATIONS,
  EXPERIENCES,
  EXPERIENCE_REVIEWS,
} from "./mock-data";

export function getExperiences() {
  return EXPERIENCES;
}

export function getExperienceById(id: string) {
  return EXPERIENCES.find((item) => item.id === id);
}

export function getExperienceReservations() {
  return EXPERIENCE_RESERVATIONS;
}

export function getReservationsByExperienceId(experienceId: string) {
  return EXPERIENCE_RESERVATIONS.filter((item) => item.experienceId === experienceId);
}

export function getExperienceCoordinations() {
  return EXPERIENCE_COORDINATIONS;
}

export function getCoordinationById(id: string) {
  return EXPERIENCE_COORDINATIONS.find((item) => item.id === id);
}

export function getExperiencePromotions() {
  return EXPERIENCE_PROMOTIONS;
}

export function getExperienceReviews() {
  return EXPERIENCE_REVIEWS;
}

export function calculateCapacityUtilization(totalCapacity: number, booked: number) {
  if (totalCapacity === 0) return 0;
  return Math.round((booked / totalCapacity) * 100);
}

export function detectScheduleConflicts(
  schedules: Array<{ start: string; end: string; facility?: string }>
) {
  const conflicts: Array<{ a: number; b: number }> = [];
  for (let i = 0; i < schedules.length; i += 1) {
    for (let j = i + 1; j < schedules.length; j += 1) {
      const a = schedules[i];
      const b = schedules[j];
      if (a.facility && b.facility && a.facility !== b.facility) continue;
      const overlap = new Date(a.start) < new Date(b.end) && new Date(b.start) < new Date(a.end);
      if (overlap) {
        conflicts.push({ a: i, b: j });
      }
    }
  }
  return conflicts;
}
