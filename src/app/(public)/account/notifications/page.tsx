import { PageHeader } from "@/components/app/page-parts";
import { NotificationList } from "@/components/account/notification-list";
import { requireUser } from "@/lib/auth/session";
import { listMyNotifications } from "@/lib/data/account";

export default async function NotificationsPage() {
  const user = await requireUser("/account/notifications");
  const items = await listMyNotifications(user);
  return (
    <>
      <PageHeader title="Notifications" description="Updates about your orders, payments and refunds." />
      <NotificationList items={items} />
    </>
  );
}
