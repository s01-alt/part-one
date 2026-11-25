import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-parts";
import { MockActions } from "@/components/app/mock-actions";
import { StatusBadge } from "@/components/app/status-badge";
import { requireAdmin } from "@/lib/auth/session";
import { adminListProducts } from "@/lib/data/account";
import { totalStock } from "@/lib/data/catalog";
import { formatNaira } from "@/lib/format";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  await requireAdmin("admin.products.manage");
  const products = await adminListProducts();
  return (
    <>
      <PageHeader title="Products" description="Remove products that break the rules. Removal hides the product and notifies the seller." />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link href={`/products/${p.slug}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell>{p.brand.name}</TableCell>
                <TableCell>{formatNaira(p.price)}</TableCell>
                <TableCell>{totalStock(p)}</TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell>
                  <MockActions
                    actions={[{ label: "Remove", result: "Removed", variant: "destructive", confirm: "Remove from marketplace?" }]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
