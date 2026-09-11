import { CheckIcon } from "@/components/icons/status-icons";
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
      <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
        Sharia Compliance Checklist
      </h3>
      <ul className="space-y-3">
        {items.map((item) => {
          // The design highlights the BVN / Haram-free item in the brand tone;
          // every other completed item uses the info tone.
          const attention = item.key === "bvn_haram_free";
          return (
            <li key={item.key}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[15px] border p-4 transition-colors",
                  item.checked
                    ? attention
                      ? "border-primary bg-primary/5"
                      : "border-info bg-info-subtle"
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
                  icon={<CheckIcon />}
                  className="mt-0.5 size-5 rounded-[5px] data-[state=checked]:border-success data-[state=checked]:bg-card data-[state=checked]:text-success shadow-none "
                />
                <span className="space-y-0.5">
                  <span className="block text-sm font-semibold text-foreground">
                    {item.title}
                  </span>
                  <span className="block text-[12px] text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
