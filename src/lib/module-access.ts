import type { PartnerRole } from "@/types";

export type ModulePermission =
  | "experience.manage"
  | "experience.submit"
  | "experience.approve"
  | "experience.analytics"
  | "transport.manage"
  | "facility.manage"
  | "accommodation.manage"
  | "sme.manage"
  | "finance.view"
  | "finance.manage"
  | "chat.access"
  | "settings.manage";

export type ModulePolicy = {
  moduleKey: string;
  managedBy: "SUPER_ADMIN";
  allowedRoles: PartnerRole[];
  requiredPermission: ModulePermission;
};

export const SUPER_ADMIN_MODULE_POLICIES: ModulePolicy[] = [
  {
    moduleKey: "experience-management",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["VILLAGE_ADMIN", "ACCOMMODATION", "UMKM", "EVENT_ORGANIZER"],
    requiredPermission: "experience.manage",
  },
  {
    moduleKey: "experience-submission",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["VILLAGE_ADMIN", "EVENT_ORGANIZER"],
    requiredPermission: "experience.submit",
  },
  {
    moduleKey: "experience-approval",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["VILLAGE_ADMIN"],
    requiredPermission: "experience.approve",
  },
  {
    moduleKey: "facility-management",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["VILLAGE_ADMIN"],
    requiredPermission: "facility.manage",
  },
  {
    moduleKey: "accommodation-management",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["ACCOMMODATION"],
    requiredPermission: "accommodation.manage",
  },
  {
    moduleKey: "sme-management",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["UMKM"],
    requiredPermission: "sme.manage",
  },
  {
    moduleKey: "finance-dashboard",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["VILLAGE_ADMIN", "ACCOMMODATION", "UMKM", "EVENT_ORGANIZER", "TRANSPORT"],
    requiredPermission: "finance.view",
  },
  {
    moduleKey: "transport-management",
    managedBy: "SUPER_ADMIN",
    allowedRoles: ["TRANSPORT"],
    requiredPermission: "transport.manage",
  },
];

const ROLE_PERMISSIONS: Record<PartnerRole, ModulePermission[]> = {
  VILLAGE_ADMIN: [
    "experience.manage",
    "experience.submit",
    "experience.approve",
    "experience.analytics",
    "facility.manage",
    "finance.view",
    "finance.manage",
    "chat.access",
    "settings.manage",
  ],
  ACCOMMODATION: [
    "accommodation.manage",
    "experience.manage",
    "experience.analytics",
    "finance.view",
    "chat.access",
    "settings.manage",
  ],
  UMKM: [
    "sme.manage",
    "experience.manage",
    "finance.view",
    "chat.access",
    "settings.manage",
  ],
  EVENT_ORGANIZER: [
    "experience.manage",
    "experience.submit",
    "experience.analytics",
    "finance.view",
    "chat.access",
    "settings.manage",
  ],
  TRANSPORT: [
    "transport.manage",
    "finance.view",
    "chat.access",
    "settings.manage",
  ],
};

export function hasModulePermission(role: PartnerRole, permission?: ModulePermission): boolean {
  if (!permission) return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRolePermissions(role: PartnerRole): ModulePermission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
