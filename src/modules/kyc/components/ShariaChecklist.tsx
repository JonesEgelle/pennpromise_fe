import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ChecklistKey, KycChecklistItem } from "@/modules/kyc/types";

interface ShariaChecklistProps {
  items: KycChecklistItem[];
  onToggle: (key: ChecklistKey, checked: boolean) => void;
  disabled?: boolean;
}

export function ShariaChecklist({
  items,
  onToggle,
  disabled,
}: ShariaChecklistProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Sharia Compliance Checklist
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key}>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                item.checked
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:bg-muted/40",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <Checkbox
                checked={item.checked}
                disabled={disabled}
                onCheckedChange={(value) =>
                  onToggle(item.key, value === true)
                }
                className="mt-0.5"
              />
              <span className="space-y-0.5">
                <span className="block text-sm font-medium text-foreground">
                  {item.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
