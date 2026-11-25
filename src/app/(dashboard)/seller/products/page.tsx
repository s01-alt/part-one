import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { ProductArt } from "@/components/product/product-art";
import { requireSeller } from "@/lib/auth/session";
import { listSellerProducts } from "@/lib/data/account";
import { totalStock } from "@/lib/data/catalog";
import { TYPE_LABELS, formatNaira } from "@/lib/format";

export const metadata = { title: "Products" };

export default async function SellerProductsPage() {
  const user = await requireSeller();
  const products = await listSellerProducts(user);
  return (
    <>
      <PageHeader
        title="Products"
        description="Products with no stock are hidden from the marketplace automatically."
        actions={
          <Button asChild className="h-10 px-4">
            <Link href="/seller/products/new">
              <Plus data-icon="inline-start" /> New product
            </Link>
          </Button>
        }
      />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const stock = totalStock(p);
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link href={`/seller/products/${p.id}`} className="flex items-center gap-3 hover:underline">
                      <ProductArt type={p.type} tone={p.tone} className="size-10 rounded" />
                      <span className="flex flex-col">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">{TYPE_LABELS[p.type]}</span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{formatNaira(p.price)}</TableCell>
                  <TableCell>{p.variants.length}</TableCell>
                  <TableCell className={stock === 0 ? "font-medium text-destructive" : stock <= 5 ? "font-medium text-amber-700" : ""}>
                    {stock === 0 ? "Sold out" : stock}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
