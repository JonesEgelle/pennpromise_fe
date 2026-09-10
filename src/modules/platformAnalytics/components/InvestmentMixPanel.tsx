import { BarList } from "@/components/shared/BarList";
import { SectionCard } from "@/components/shared/SectionCard";
import type { InvestmentMixSlice } from "@/modules/platformAnalytics/types";

interface InvestmentMixPanelProps {
  slices: InvestmentMixSlice[];
  note: string;
}

export function InvestmentMixPanel({ slices, note }: InvestmentMixPanelProps) {
  return (
    <SectionCard
      title="Halal Investment Mix"
      className="shadow-none rounded-[15px]"
    >
      <BarList
        items={slices.map((slice) => ({
          label: slice.label,
          percent: slice.percent,
          tone: slice.tone,
        }))}
        note={note}
      />
    </SectionCard>
  );
}
