import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  /** Leading glyph rendered before the title. */
  icon?: React.ReactNode;
  /** Right-aligned header slot: a "VIEW ALL" link, status badge, legend, etc. */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  /** Drop the default content padding (e.g. for an edge-to-edge table). */
  flushContent?: boolean;
}

/** Titled panel used across dashboard screens. Composes the `ui/card` shell. */
export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  className,
  titleClassName,
  contentClassName,
  flushContent,
}: SectionCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex items-center gap-2">
          {icon ? <span className="shrink-0">{icon}</span> : null}
          <div className="space-y-1">
            <CardTitle className={titleClassName}>{title}</CardTitle>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1",
          flushContent ? "p-0" : undefined,
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
