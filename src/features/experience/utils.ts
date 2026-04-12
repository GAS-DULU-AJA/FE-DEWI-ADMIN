import {
  EXPERIENCE_COORDINATIONS,
  EXPERIENCE_PROMOTIONS,
  EXPERIENCE_RESERVATIONS,
  EXPERIENCES,
  EXPERIENCE_REVIEWS,
  SPEAKERS,
  POST_EVENT_SURVEYS,
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

export function getSpeakers() {
  return SPEAKERS;
}

export function getSpeakerById(id: string) {
  return SPEAKERS.find((item) => item.id === id);
}

export function getPostEventSurveys() {
  return POST_EVENT_SURVEYS;
}

export function getSurveyByExperienceId(experienceId: string) {
  return POST_EVENT_SURVEYS.find((item) => item.experienceId === experienceId);
}

export function getDocumentsByExperienceId(experienceId: string) {
  const experience = getExperienceById(experienceId);
  return experience?.documents ?? [];
}

export function getNotificationsByExperienceId(experienceId: string) {
  const experience = getExperienceById(experienceId);
  return experience?.notifications ?? [];
}

export function calculateCapacityUtilization(totalCapacity: number, booked: number) {
  if (totalCapacity === 0) return 0;
  return Math.round((booked / totalCapacity) * 100);
}

export function calculateCheckInRate(totalBookings: number, checkedIn: number) {
  if (totalBookings === 0) return 0;
  return Math.round((checkedIn / totalBookings) * 100);
}

export function calculateNoShowRate(totalBookings: number, noShow: number) {
  if (totalBookings === 0) return 0;
  return Math.round((noShow / totalBookings) * 100);
}

export function calculateTicketRevenue(experiences: typeof EXPERIENCES) {
  return experiences.reduce((total, exp) => {
    return total + exp.ticketTypes.reduce((sum, tkt) => sum + tkt.price * tkt.sold, 0);
  }, 0);
}

export function getAttendeeStats(experienceId: string) {
  const reservations = getReservationsByExperienceId(experienceId);
  const total = reservations.reduce((sum, r) => sum + r.quantity, 0);
  const checkedIn = reservations.filter((r) => r.bookingStatus === "checked_in").length;
  const noShow = reservations.filter((r) => r.bookingStatus === "no_show").length;
  const cancelled = reservations.filter((r) => r.bookingStatus === "cancelled").length;
  return { total, checkedIn, noShow, cancelled, confirmed: total - checkedIn - noShow - cancelled };
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
