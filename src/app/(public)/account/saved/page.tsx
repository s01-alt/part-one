import { EmptyState, PageHeader } from "@/components/app/page-parts";
import { ProductGrid } from "@/components/product/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/lib/auth/session";
import { listMySaved } from "@/lib/data/account";

export default async function SavedPage() {
  const user = await requireUser("/account/saved");
  const { saved, liked } = await listMySaved(user);
  return (
    <>
      <PageHeader title="Saved & liked" description="Only you can see these." />
      <Tabs defaultValue="saved">
        <TabsList>
          <TabsTrigger value="saved">Saved ({saved.length})</TabsTrigger>
          <TabsTrigger value="liked">Liked ({liked.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="pt-6">
          {saved.length ? <ProductGrid products={saved} /> : <EmptyState title="Nothing saved yet" />}
        </TabsContent>
        <TabsContent value="liked" className="pt-6">
          {liked.length ? <ProductGrid products={liked} /> : <EmptyState title="No likes yet" />}
        </TabsContent>
      </Tabs>
    </>
  );
}
