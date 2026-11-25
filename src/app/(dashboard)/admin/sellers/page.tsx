import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-parts";
import { MockActions } from "@/components/app/mock-actions";
import { StatusBadge } from "@/components/app/status-badge";
import { requireAdmin } from "@/lib/auth/session";
import { adminListApplications, adminListBrands } from "@/lib/data/account";
import { STYLE_LABELS, formatDate } from "@/lib/format";

export default async function AdminSellersPage() {
  await requireAdmin("admin.sellers.review");
  const [apps, brands] = await Promise.all([adminListApplications(), adminListBrands()]);
  return (
    <>
      <PageHeader title="Sellers" description="Statuses: Pending → Under review → Approved / Rejected. Approved sellers can be suspended." />
      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications ({apps.length})</TabsTrigger>
          <TabsTrigger value="brands">Brands ({brands.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="flex flex-col gap-4 pt-6">
          {apps.map((a) => (
            <article key={a.id} className="flex flex-col gap-3 rounded-lg border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{a.brandName}</h2>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-sm">{a.description}</p>
              <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-muted-foreground">Contact</dt>
                <dd>
                  {a.contactName} · {a.email} · {a.phone}
                </dd>
                <dt className="text-muted-foreground">City</dt>
                <dd>{a.city}</dd>
                <dt className="text-muted-foreground">Instagram</dt>
                <dd>@{a.instagram}</dd>
                <dt className="text-muted-foreground">Styles</dt>
                <dd>{a.styles.map((s) => STYLE_LABELS[s]).join(", ")}</dd>
                <dt className="text-muted-foreground">Submitted</dt>
                <dd>{formatDate(a.submittedAt)}</dd>
              </dl>
              {(a.status === "pending" || a.status === "under_review") && (
                <MockActions
                  actions={[
                    ...(a.status === "pending" ? [{ label: "Start review", result: "Moved to Under review" }] : []),
                    { label: "Approve", result: "Approved — storefront created", variant: "default" as const, confirm: `Approve ${a.brandName}?` },
                    { label: "Reject", result: "Rejected", variant: "destructive" as const, confirm: "Reject this application?" },
                  ]}
                />
              )}
            </article>
          ))}
        </TabsContent>
        <TabsContent value="brands" className="pt-6">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link href={`/brands/${b.slug}`} className="font-medium hover:underline">
                        {b.name}
                      </Link>
                    </TableCell>
                    <TableCell>{b.city}</TableCell>
                    <TableCell>{formatDate(b.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      <MockActions
                        actions={[
                          { label: "Suspend", result: "Suspended — products hidden", variant: "destructive", confirm: "Suspend and hide all products?" },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
