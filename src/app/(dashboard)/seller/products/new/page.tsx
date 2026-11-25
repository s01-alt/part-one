import { PageHeader } from "@/components/app/page-parts";
import { ProductEditor } from "@/components/seller/product-editor";
import { requireSeller } from "@/lib/auth/session";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireSeller();
  return (
    <>
      <PageHeader title="New product" description="Add details, up to 5 images, and stock for each size and colour." />
      <ProductEditor />
    </>
  );
}
