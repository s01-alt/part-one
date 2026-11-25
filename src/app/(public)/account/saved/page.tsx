import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-parts";
import { SavedTabs } from "@/components/account/saved-tabs";
import { requireUser } from "@/lib/auth/session";
import { listMySaved } from "@/lib/data/account";
import { listProducts } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Saved & liked" };

export default async function SavedPage() {
  const user = await requireUser("/account/saved");
  const [{ saved, liked }, catalog] = await Promise.all([listMySaved(user), listProducts({ pageSize: 100 })]);
  return (
    <>
      <PageHeader title="Saved & liked" description="Only you can see these." />
      <SavedTabs saved={saved} liked={liked} catalog={catalog.items} />
    </>
  );
}
