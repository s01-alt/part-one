import { Panel, PageHeader, MockNotice } from "@/components/app/page-parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ROLE_LABELS, ADMIN_ROLE_PERMISSIONS, PERMISSIONS } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { adminGetSettings } from "@/lib/data/account";
import type { AdminRole } from "@/lib/types";

const ROLES = Object.keys(ADMIN_ROLE_PERMISSIONS) as AdminRole[];

export const metadata = { title: "Settings & roles" };

export default async function AdminSettingsPage() {
  await requireAdmin("admin.settings.manage");
  const settings = await adminGetSettings();
  return (
    <>
      <PageHeader title="Settings & roles" />
      <div className="flex flex-col gap-6">
        <Panel title="Marketplace settings">
          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="commission">Default commission (%)</Label>
              <Input id="commission" type="number" step="0.5" min={0} max={50} defaultValue={settings.defaultCommissionRate * 100} className="h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="threshold">Payout minimum (₦)</Label>
              <Input id="threshold" type="number" step={1000} min={0} defaultValue={settings.payoutThreshold / 100} className="h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vat">VAT (%)</Label>
              <Input id="vat" type="number" step="0.5" defaultValue={settings.vatRate * 100} className="h-10" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Commission changes apply to new orders only. Each order stores the rate it was charged at. Per-seller
            overrides live on the seller record.
          </p>
          <div className="mt-4">
            <MockNotice />
          </div>
        </Panel>

        <Panel title="Admin roles">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium">Permission</th>
                  {ROLES.map((r) => (
                    <th key={r} className="p-2 font-medium">
                      {ADMIN_ROLE_LABELS[r]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((p) => (
                  <tr key={p} className="border-b last:border-0">
                    <td className="p-2 font-mono text-xs">{p}</td>
                    {ROLES.map((r) => (
                      <td key={r} className="p-2 text-center">
                        {ADMIN_ROLE_PERMISSIONS[r].includes(p) ? "✓" : <span className="text-muted-foreground">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
