"use client";

import Link from "next/link";
import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MockNotice } from "@/components/app/page-parts";

/**
 * Signed-in actions on the product page. The page itself is prerendered, so the
 * server decides (inside <Suspense>) whether to render these or a sign-in link.
 * Backend: POST /v1/products/:id/comments, POST /v1/reports.
 */

export function CommentComposer({ userName }: { userName: string }) {
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const text = body.trim();
          if (!text) return;
          setPosted((p) => [text, ...p]);
          setBody("");
        }}
      >
        <label htmlFor="comment-body" className="text-sm font-medium">
          Comment as {userName}
        </label>
        <Textarea
          id="comment-body"
          rows={3}
          maxLength={1000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ask about fit, fabric, restocks…"
        />
        <Button type="submit" className="h-9 w-fit" disabled={!body.trim()}>
          Post comment
        </Button>
      </form>
      {posted.length > 0 && (
        <>
          <ul className="flex flex-col gap-5">
            {posted.map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background" aria-hidden>
                  {userName.slice(0, 1)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {userName} <span className="font-normal text-muted-foreground">· just now</span>
                  </span>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <MockNotice>Preview only — comments are not saved until the backend is connected.</MockNotice>
        </>
      )}
    </div>
  );
}

const REASONS = [
  { value: "counterfeit", label: "Counterfeit or copied design" },
  { value: "misleading", label: "Misleading photos or description" },
  { value: "offensive", label: "Offensive content" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Something else" },
];

export function ReportButton() {
  const [state, setState] = useState<"idle" | "open" | "sent">("idle");
  const [reason, setReason] = useState(REASONS[0].value);

  if (state === "sent") {
    return <MockNotice>Thanks — our team will review this. (Preview only: the report was not sent.)</MockNotice>;
  }
  if (state === "open") {
    return (
      <form
        className="flex flex-col gap-2 rounded-md border p-3 text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setState("sent");
        }}
      >
        <label htmlFor="report-reason" className="font-medium">
          Why are you reporting this product?
        </label>
        <select
          id="report-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-2"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <Textarea rows={2} maxLength={500} placeholder="Anything else we should know? (optional)" aria-label="Details" />
        <div className="flex gap-2">
          <Button type="submit" className="h-8">
            Send report
          </Button>
          <Button type="button" variant="ghost" className="h-8" onClick={() => setState("idle")}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setState("open")}
      className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline"
    >
      <Flag className="size-3.5" aria-hidden /> Report this product
    </button>
  );
}

export function SignInToComment({ next }: { next: string }) {
  return (
    <div className="rounded-md border border-dashed p-4 text-sm">
      <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium underline underline-offset-4">
        Sign in
      </Link>{" "}
      to join the conversation.
    </div>
  );
}
