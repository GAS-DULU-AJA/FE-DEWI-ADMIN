"use client";

import { create } from "zustand";
import { FACILITIES, FACILITY_RESERVATIONS } from "../mock-data";
import type {
  Facility,
  FacilityCategory,
  FacilityReservation,
  FacilityReservationStatus,
} from "../types";

export type FacilityInput = {
  name: string;
  category: FacilityCategory;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: string;
  contact?: string;
  isMonetizable: boolean;
  rentalPrice?: number;
  capacity?: number;
  utilizationRate?: number;
};

interface FacilityManagementState {
  facilities: Facility[];
  reservations: FacilityReservation[];
  upsertFacility: (payload: FacilityInput, facilityId?: string) => void;
  deleteFacility: (facilityId: string) => void;
  updateReservationStatus: (reservationId: string, status: FacilityReservationStatus) => void;
  checkScheduleConflict: (facilityId: string, startDate: string, endDate: string, excludeReservationId?: string) => FacilityReservation | null;
}

function normalizeNumber(value: number | undefined): number | undefined {
  return Number.isFinite(value) ? value : undefined;
}

function checkDateOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const date1Start = new Date(start1).getTime();
  const date1End = new Date(end1).getTime();
  const date2Start = new Date(start2).getTime();
  const date2End = new Date(end2).getTime();

  return date1Start <= date2End && date2Start <= date1End;
}

export const useFacilityManagementStore = create<FacilityManagementState>((set, get) => ({
  facilities: FACILITIES,
  reservations: FACILITY_RESERVATIONS,

  upsertFacility: (payload, facilityId) =>
    set((state) => {
      const normalized: Facility = {
        id: facilityId ?? `fac-${Date.now()}`,
        name: payload.name.trim(),
        category: payload.category,
        description: payload.description.trim(),
        address: payload.address.trim(),
        latitude: normalizeNumber(payload.latitude),
        longitude: normalizeNumber(payload.longitude),
        operatingHours: payload.operatingHours?.trim() || undefined,
        contact: payload.contact?.trim() || undefined,
        isMonetizable: payload.isMonetizable,
        photos: [],
        rentalPrice: payload.isMonetizable ? normalizeNumber(payload.rentalPrice) : undefined,
        capacity: normalizeNumber(payload.capacity),
        utilizationRate: normalizeNumber(payload.utilizationRate),
      };

      if (!facilityId) {
        return {
          facilities: [normalized, ...state.facilities],
        };
      }

      return {
        facilities: state.facilities.map((facility) =>
          facility.id === facilityId ? { ...facility, ...normalized } : facility
        ),
      };
    }),

  deleteFacility: (facilityId) =>
    set((state) => ({
      facilities: state.facilities.filter((facility) => facility.id !== facilityId),
      reservations: state.reservations.map((reservation) =>
        reservation.facilityId === facilityId && reservation.status === "pending"
          ? {
              ...reservation,
              status: "rejected",
              notes: `${reservation.notes ? `${reservation.notes} ` : ""}Facility removed by village admin.`,
            }
          : reservation
      ),
    })),

  updateReservationStatus: (reservationId, status) =>
    set((state) => ({
      reservations: state.reservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status } : reservation
      ),
    })),

  checkScheduleConflict: (facilityId, startDate, endDate, excludeReservationId) => {
    const state = get();
    const conflicts = state.reservations.filter((reservation) => {
      if (
        reservation.facilityId !== facilityId ||
        reservation.status === "rejected" ||
        reservation.status === "completed"
      ) {
        return false;
      }

      if (excludeReservationId && reservation.id === excludeReservationId) {
        return false;
      }

      return checkDateOverlap(
        startDate,
        endDate,
        reservation.startDate,
        reservation.endDate
      );
    });

    return conflicts.length > 0 ? conflicts[0] : null;
  },
}));
