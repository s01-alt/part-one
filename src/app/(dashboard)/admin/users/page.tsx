import type { Metadata } from "next";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-parts";
import { UserRow } from "@/components/admin/user-row";
import { can } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { adminListUsers } from "@/lib/data/account";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const me = await requireAdmin("admin.users.manage");
  const users = await adminListUsers();
  const canManageRoles = can(me, "admin.roles.manage");
  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone signs in with Google as a customer. Brands get seller access when their application is approved; admin access is granted here."
      />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <UserRow key={u.id} user={u} isSelf={u.id === me.id} canManageRoles={canManageRoles} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
