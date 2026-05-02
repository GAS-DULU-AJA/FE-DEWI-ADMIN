import type { VillageApprovalStatus } from "@/types";

export interface TransportProfile {
  id: string;
  ownerId: string;
  ownerName: string;
  companyName: string;
  villageId: string;
  villageName: string;
  villageApprovalStatus: VillageApprovalStatus;
  villageApprovalNote?: string;
  phone: string;
  email: string;
  address: string;
  npwp?: string;
  licenseNumber: string;
  rating: number;
  totalVehicles: number;
  totalDrivers: number;
  isActive: boolean;
  createdAt: string;
}

export type VehicleType = "minibus" | "bus" | "car" | "van" | "motorcycle" | "shuttle";
export type VehicleStatus = "available" | "booked" | "maintenance" | "inactive";

export interface Vehicle {
  id: string;
  transportId: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  capacity: number;
  features: string[];
  status: VehicleStatus;
  photo?: string;
  lastService?: string;
  nextService?: string;
  mileage: number;
  createdAt: string;
}

export type DriverStatus = "active" | "inactive" | "on_duty" | "off_duty";

export interface Driver {
  id: string;
  transportId: string;
  fullName: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehicle?: string;
  rating: number;
  totalTrips: number;
  photo?: string;
  createdAt: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TransportBooking {
  id: string;
  transportId: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string;
  driverName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  routeId?: string;
  routeName?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate?: string;
  passengers: number;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export interface TransportRoute {
  id: string;
  transportId: string;
  name: string;
  description?: string;
  origin: string;
  destination: string;
  waypoints?: string[];
  distanceKm: number;
  durationHours: number;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface TransportRate {
  id: string;
  transportId: string;
  vehicleType: VehicleType;
  rateType: "per_km" | "per_hour" | "per_day" | "fixed";
  price: number;
  minHours?: number;
  maxPassengers: number;
  notes?: string;
}

export interface TransportStats {
  totalBookings: number;
  pendingBookings: number;
  completedTrips: number;
  totalRevenue: number;
  utilizationPercent: number;
  avgRating: number;
  activeVehicles: number;
  activeDrivers: number;
}
