"use client";

import { EmptyState } from "@/components/app/page-parts";
import { ProductGrid } from "@/components/product/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEngagement } from "@/lib/store/engagement";
import type { ProductWithBrand } from "@/lib/types";

/**
 * Saved & liked lists. MOCK: merges the account's mock lists with items
 * saved/liked in this browser (lib/store/engagement.ts), so saving a product
 * shows up here. Backend: GET /v1/me/saves and /v1/me/likes only.
 */
export function SavedTabs({
  saved,
  liked,
  catalog,
}: {
  saved: ProductWithBrand[];
  liked: ProductWithBrand[];
  catalog: ProductWithBrand[];
}) {
  const localSaved = useEngagement((s) => s.saved);
  const localLiked = useEngagement((s) => s.liked);

  const merge = (base: ProductWithBrand[], ids: string[]) => {
    const extra = catalog.filter((p) => ids.includes(p.id) && !base.some((b) => b.id === p.id));
    return [...extra, ...base];
  };
  const savedAll = merge(saved, localSaved);
  const likedAll = merge(liked, localLiked);

  return (
    <Tabs defaultValue="saved">
      <TabsList>
        <TabsTrigger value="saved">Saved ({savedAll.length})</TabsTrigger>
        <TabsTrigger value="liked">Liked ({likedAll.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="saved" className="pt-6">
        {savedAll.length ? <ProductGrid products={savedAll} /> : <EmptyState title="Nothing saved yet" />}
      </TabsContent>
      <TabsContent value="liked" className="pt-6">
        {likedAll.length ? <ProductGrid products={likedAll} /> : <EmptyState title="No likes yet" />}
      </TabsContent>
    </Tabs>
  );
}
