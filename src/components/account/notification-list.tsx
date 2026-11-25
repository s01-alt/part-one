import Link from "next/link";
import { EmptyState } from "@/components/app/page-parts";
import { formatDate } from "@/lib/format";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

/** In-app notifications (no email in v1). Backend: GET /v1/me/notifications, POST …/read. */
export function NotificationList({ items }: { items: Notification[] }) {
  if (!items.length) return <EmptyState title="No notifications" />;
  return (
    <ul className="flex flex-col divide-y rounded-lg border bg-card">
      {items.map((n) => {
        const body = (
          <div className="flex gap-3 p-4">
            <span
              className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.readAt ? "bg-transparent" : "bg-brand")}
              aria-label={n.readAt ? undefined : "Unread"}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className={cn("text-sm", !n.readAt && "font-semibold")}>{n.title}</span>
              <span className="text-sm text-muted-foreground">{n.body}</span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
          </div>
        );
        return (
          <li key={n.id}>
            {n.href ? (
              <Link href={n.href} className="block hover:bg-accent">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}
