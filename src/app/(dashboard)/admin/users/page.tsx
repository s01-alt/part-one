import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-parts";
import { MockActions } from "@/components/app/mock-actions";
import { StatusBadge } from "@/components/app/status-badge";
import { ADMIN_ROLE_LABELS } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { adminListUsers } from "@/lib/data/account";
import { formatDate } from "@/lib/format";

export default async function AdminUsersPage() {
  await requireAdmin("admin.users.manage");
  const users = await adminListUsers();
  return (
    <>
      <PageHeader title="Users" description="Customer, seller and admin accounts." />
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
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  {u.adminRole ? `Admin · ${ADMIN_ROLE_LABELS[u.adminRole]}` : u.sellerBrandId ? "Seller" : "Customer"}
                </TableCell>
                <TableCell>{formatDate(u.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={u.status} />
                </TableCell>
                <TableCell>
                  {u.adminRole !== "founder" && (
                    <MockActions
                      actions={[
                        u.status === "active"
                          ? { label: "Suspend", result: "Suspended", variant: "destructive", confirm: "Suspend this account?" }
                          : { label: "Reactivate", result: "Reactivated" },
                      ]}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
