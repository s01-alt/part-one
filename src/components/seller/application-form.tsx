"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MockNotice } from "@/components/app/page-parts";
import { STYLE_LABELS } from "@/lib/format";
import { STYLE_TAGS } from "@/lib/types";

/** Backend: POST /v1/seller-applications → status "pending". Bank details are collected after approval. */
export function SellerApplicationForm({ contactName, email }: { contactName: string; email: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="mt-10 flex flex-col gap-4 rounded-lg border bg-card p-8">
        <h2 className="text-xl font-semibold">Application received</h2>
        <p className="text-muted-foreground">
          Status: <strong>Pending</strong>. We&apos;ll notify you in the app when it moves to review and when we
          decide.
        </p>
        <MockNotice>Preview only — this application was not saved.</MockNotice>
      </div>
    );
  }

  return (
    <form
      className="mt-10 flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <F id="brandName" label="Brand name" />
        <F id="city" label="City" placeholder="Lagos" />
        <F id="contactName" label="Your name" defaultValue={contactName} />
        <F id="email" label="Email" type="email" defaultValue={email} />
        <F id="phone" label="Phone" type="tel" placeholder="+234…" />
        <F id="instagram" label="Instagram handle" placeholder="@yourbrand" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">About your brand</Label>
        <Textarea id="description" name="description" required rows={4} placeholder="What you make, who it's for, how it's produced." />
      </div>
      <fieldset>
        <legend className="mb-3 text-sm font-medium">Styles you make</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {STYLE_TAGS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox name="styles" value={s} /> {STYLE_LABELS[s]}
            </label>
          ))}
        </div>
      </fieldset>
      <F id="catalogueUrl" label="Link to photos of your products" type="url" placeholder="https://…" />
      <label className="flex items-start gap-2 text-sm">
        <Checkbox required className="mt-0.5" />
        <span>I confirm the products I list are original designs that I have the right to sell, and I agree to the seller terms.</span>
      </label>
      <Button type="submit" className="h-12 w-fit px-6 text-base">
        Submit application
      </Button>
    </form>
  );
}

function F({ id, label, ...rest }: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required className="h-10" {...rest} />
    </div>
  );
}
