"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/format";

/** MOCK: local state only. Backend: PUT|DELETE /v1/brands/:id/follow (requires sign-in). */
export function FollowButton({ followerCount }: { followerCount: number }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <Button
        variant={following ? "outline" : "default"}
        className="h-11 px-5"
        aria-pressed={following}
        onClick={() => setFollowing((f) => !f)}
      >
        {following ? <Check data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
        {following ? "Following" : "Follow"}
      </Button>
      <span className="text-sm text-muted-foreground">
        {formatCount(followerCount + (following ? 1 : 0))} followers
      </span>
    </div>
  );
}
