"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { trackEvent } from "@/lib/track-event";

type TrackedLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  eventName?: string;
  eventMeta?: Record<string, string | number | boolean>;
  onClick?: () => void;
};

export function TrackedLink({
  children,
  className,
  eventName,
  eventMeta,
  onClick,
  ...linkProps
}: TrackedLinkProps) {
  return (
    <Link
      {...linkProps}
      className={className}
      onClick={() => {
        if (eventName) {
          trackEvent(eventName, eventMeta);
        }
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
