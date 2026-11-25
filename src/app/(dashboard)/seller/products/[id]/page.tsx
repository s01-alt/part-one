import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/page-parts";
import { ProductEditor } from "@/components/seller/product-editor";
import { requireSeller } from "@/lib/auth/session";
import { getSellerProduct } from "@/lib/data/account";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/seller/products/[id]">) {
  const { id } = await params;
  const user = await requireSeller();
  // Returns null for another seller's product → 404, so IDs can't be probed.
  const product = await getSellerProduct(user, id);
  if (!product) notFound();
  return (
    <>
      <PageHeader
        title={product.name}
        description={
          <Link href={`/products/${product.slug}`} className="underline underline-offset-4">
            View in marketplace
          </Link>
        }
      />
      <ProductEditor product={product} />
    </>
  );
}
