import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/app/page-parts";
import { requireUser } from "@/lib/auth/session";
import { listMyFollowedBrands } from "@/lib/data/account";

export default async function FollowingPage() {
  const user = await requireUser("/account/following");
  const brands = await listMyFollowedBrands(user);
  return (
    <>
      <PageHeader title="Following" description="Brands you follow. You'll see their new drops first." />
      {brands.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {brands.map((b) => (
            <li key={b.id}>
              <Link href={`/brands/${b.slug}`} className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:border-foreground">
                <span
                  className="flex size-12 items-center justify-center rounded-full font-heading text-lg uppercase"
                  style={{ backgroundColor: b.tone }}
                  aria-hidden
                >
                  {b.name.slice(0, 1)}
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-sm text-muted-foreground">{b.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="You're not following any brands yet" />
      )}
    </>
  );
}
