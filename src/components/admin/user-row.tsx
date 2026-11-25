"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/status-badge";
import { ADMIN_ROLE_LABELS } from "@/lib/auth/permissions";
import { formatDate } from "@/lib/format";
import type { AdminRole, User } from "@/lib/types";

const ACCESS_OPTIONS: { value: "" | AdminRole; label: string }[] = [
  { value: "", label: "Customer" },
  { value: "founder", label: `Admin · ${ADMIN_ROLE_LABELS.founder}` },
  { value: "report_manager", label: `Admin · ${ADMIN_ROLE_LABELS.report_manager}` },
  { value: "developer", label: `Admin · ${ADMIN_ROLE_LABELS.developer}` },
];

/**
 * One row of the admin Users table. Admins are not self-registered: a person
 * signs in with Google as a customer, then a Founder grants an admin role here.
 * MOCK: local state only. Backend: PUT /v1/admin/users/:id/admin-role
 * (permission admin.roles.manage, audit-logged, revokes the user's sessions).
 */
export function UserRow({
  user,
  isSelf,
  canManageRoles,
}: {
  user: User;
  isSelf: boolean;
  canManageRoles: boolean;
}) {
  const [role, setRole] = useState<"" | AdminRole>(user.adminRole ?? "");
  const [status, setStatus] = useState(user.status);
  const [pendingRole, setPendingRole] = useState<"" | AdminRole | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const roleLocked = isSelf || !canManageRoles || Boolean(user.sellerBrandId);
  const label = (v: "" | AdminRole) => ACCESS_OPTIONS.find((o) => o.value === v)!.label;

  return (
    <TableRow>
      <TableCell className="font-medium">
        {user.name}
        {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {user.sellerBrandId ? (
          "Seller"
        ) : roleLocked ? (
          label(role)
        ) : pendingRole !== null ? (
          <span className="flex flex-wrap items-center gap-2 text-xs">
            Change to {label(pendingRole)}?
            <Button
              className="h-7"
              onClick={() => {
                setRole(pendingRole);
                setPendingRole(null);
                setNote("Access updated (preview — not saved)");
              }}
            >
              Confirm
            </Button>
            <Button variant="ghost" className="h-7" onClick={() => setPendingRole(null)}>
              Cancel
            </Button>
          </span>
        ) : (
          <select
            aria-label={`Access for ${user.name}`}
            value={role}
            onChange={(e) => setPendingRole(e.target.value as "" | AdminRole)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
          >
            {ACCESS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        {note && <span className="mt-1 block text-xs text-muted-foreground">{note}</span>}
      </TableCell>
      <TableCell>{formatDate(user.createdAt)}</TableCell>
      <TableCell>
        <StatusBadge status={status} />
      </TableCell>
      <TableCell>
        {!isSelf && role !== "founder" && (
          <Button
            variant={status === "active" ? "destructive" : "outline"}
            className="h-8"
            onClick={() => {
              setStatus(status === "active" ? "suspended" : "active");
              setNote(status === "active" ? "Suspended (preview — not saved)" : "Reactivated (preview — not saved)");
            }}
          >
            {status === "active" ? "Suspend" : "Reactivate"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
