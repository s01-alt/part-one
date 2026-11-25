import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/page-parts";
import { StoreSettingsForm } from "@/components/seller/store-settings-form";
import { requireSeller } from "@/lib/auth/session";
import { getMyBrand } from "@/lib/data/account";

export const metadata = { title: "Store settings" };

export default async function StoreSettingsPage() {
  const user = await requireSeller();
  const brand = await getMyBrand(user);
  if (!brand) notFound();
  return (
    <>
      <PageHeader
        title="Store settings"
        description={
          <Link href={`/brands/${brand.slug}`} className="underline underline-offset-4">
            View your storefront
          </Link>
        }
      />
      <StoreSettingsForm brand={brand} />
    </>
  );
}
