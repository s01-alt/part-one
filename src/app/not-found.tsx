import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-heading text-8xl text-muted-foreground">404</p>
      <h1 className="font-heading text-4xl uppercase">This page sold out</h1>
      <p className="max-w-md text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Button asChild className="h-11 px-5">
        <Link href="/shop">Back to the shop</Link>
      </Button>
    </main>
  );
}
