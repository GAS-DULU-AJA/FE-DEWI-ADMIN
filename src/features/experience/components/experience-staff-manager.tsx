"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StaffPermissionKey =
  | "updateTaskProgress"
  | "scanTicketAttendance"
  | "viewEquipmentStockReport";

type StaffPermissionState = Record<StaffPermissionKey, boolean>;

type AssignedStaff = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  permissions: StaffPermissionState;
};

const defaultPermissions: StaffPermissionState = {
  updateTaskProgress: true,
  scanTicketAttendance: false,
  viewEquipmentStockReport: false,
};

const permissionLabels: Record<StaffPermissionKey, { id: string; en: string }> = {
  updateTaskProgress: {
    id: "Update progres tugas",
    en: "Update task progress",
  },
  scanTicketAttendance: {
    id: "Scan tiket / presensi",
    en: "Scan ticket / attendance",
  },
  viewEquipmentStockReport: {
    id: "Lihat laporan stok / alat",
    en: "View equipment / stock report",
  },
};

export function ExperienceStaffManager({ isId }: { isId: boolean }) {
  const [staffList, setStaffList] = useState<AssignedStaff[]>([
    {
      id: "staff-1",
      name: "Raka Saputra",
      email: "raka.staff@dewi.id",
      isActive: true,
      permissions: {
        updateTaskProgress: true,
        scanTicketAttendance: true,
        viewEquipmentStockReport: false,
      },
    },
    {
      id: "staff-2",
      name: "Maya Lestari",
      email: "maya.staff@dewi.id",
      isActive: true,
      permissions: {
        updateTaskProgress: true,
        scanTicketAttendance: false,
        viewEquipmentStockReport: true,
      },
    },
  ]);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  const activeCount = useMemo(
    () => staffList.filter((item) => item.isActive).length,
    [staffList]
  );

  const handleAddLocal = () => {
    if (!formName.trim() || !formEmail.trim()) return;

    const newStaff: AssignedStaff = {
      id: `staff-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      isActive: true,
      permissions: { ...defaultPermissions },
    };

    setStaffList((prev) => [newStaff, ...prev]);
    setFormName("");
    setFormEmail("");
  };

  const togglePermission = (staffId: string, permission: StaffPermissionKey) => {
    setStaffList((prev) =>
      prev.map((item) => {
        if (item.id !== staffId) return item;
        return {
          ...item,
          permissions: {
            ...item.permissions,
            [permission]: !item.permissions[permission],
          },
        };
      })
    );
  };

  const toggleActive = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((item) =>
        item.id === staffId
          ? {
              ...item,
              isActive: !item.isActive,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{isId ? "Pengaturan Pelaksana Event" : "Event Staff Assignment"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-stone-600">
          <p>
            {isId
              ? "Kelola penugasan Pelaksana dan izin fitur per-event. Akses keuangan tetap terkunci dan tidak dapat didelegasikan."
              : "Manage staff assignment and per-event feature access. Financial access remains locked and cannot be delegated."}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs text-stone-500">{isId ? "Total Pelaksana" : "Total Staff"}</p>
              <p className="text-xl font-bold text-stone-900">{staffList.length}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs text-stone-500">{isId ? "Aktif" : "Active"}</p>
              <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs text-red-600">{isId ? "Akses Keuangan" : "Financial Access"}</p>
              <p className="text-sm font-semibold text-red-700">{isId ? "SELALU TERTUTUP" : "ALWAYS LOCKED"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isId ? "Tambah Pelaksana (Mock)" : "Add Staff (Mock)"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Input
              placeholder={isId ? "Nama pelaksana" : "Staff name"}
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
            />
            <Input
              placeholder={isId ? "Email pelaksana" : "Staff email"}
              value={formEmail}
              onChange={(event) => setFormEmail(event.target.value)}
            />
            <Button type="button" onClick={handleAddLocal}>
              {isId ? "Tambahkan" : "Add"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            {isId
              ? "UI ini belum tersambung ke API. Perubahan hanya tersimpan di state lokal halaman."
              : "This UI is not connected to API yet. Changes are stored in local page state only."}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {staffList.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="pt-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{staff.name}</p>
                  <p className="text-xs text-stone-500">{staff.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={staff.isActive ? "default" : "secondary"}>
                      {staff.isActive
                        ? isId
                          ? "Aktif"
                          : "Active"
                        : isId
                          ? "Nonaktif"
                          : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="border-red-300 text-red-700">
                      {isId ? "Keuangan: Terkunci" : "Finance: Locked"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleActive(staff.id)}
                  >
                    {staff.isActive
                      ? isId
                        ? "Nonaktifkan"
                        : "Deactivate"
                      : isId
                        ? "Aktifkan"
                        : "Activate"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(Object.keys(permissionLabels) as StaffPermissionKey[]).map((permissionKey) => {
                  const label = permissionLabels[permissionKey];
                  return (
                    <label
                      key={permissionKey}
                      className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2"
                    >
                      <span className="text-sm text-stone-700">{isId ? label.id : label.en}</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-emerald-600"
                        checked={staff.permissions[permissionKey]}
                        onChange={() => togglePermission(staff.id, permissionKey)}
                        disabled={!staff.isActive}
                      />
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
