import { useTranslations } from "next-intl";
import { Check, X as XIcon } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

interface ComparisonRow {
  feature: string;
  agency: boolean;
  freelancer: boolean;
  kingdom: boolean;
}

export function Comparison() {
  const t = useTranslations("comparison");
  const columns = t.raw("columns") as string[];
  const comparisonRows = t.raw("rows") as ComparisonRow[];

  return (
    <section id="comparison" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          align="center"
          className="mb-12"
        />

        <Reveal>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-2xl border border-edge bg-white sm:block">
            <div className="grid grid-cols-4 border-b border-edge">
              <div className="p-5" />
              {columns.slice(1).map((col, i) => (
                <div key={col} className={`p-5 text-center ${i === 2 ? "bg-cyan/5" : ""}`}>
                  <p className={i === 2 ? "font-display text-sm font-bold text-ink" : "text-sm font-medium text-muted"}>
                    {col}
                  </p>
                </div>
              ))}
            </div>

            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}
              >
                <div className="flex items-center p-4 pl-5">
                  <p className="text-sm text-muted">{row.feature}</p>
                </div>
                {[row.agency, row.freelancer, row.kingdom].map((val, j) => (
                  <div key={j} className={`flex items-center justify-center p-4 ${j === 2 ? "bg-cyan/5" : ""}`}>
                    {val ? (
                      <Check size={18} weight="bold" className={j === 2 ? "text-cyan" : "text-gray-300"} />
                    ) : (
                      <XIcon size={18} className="text-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Mobile: stacked blocks */}
          <div className="space-y-3 sm:hidden">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="rounded-xl border border-edge bg-white p-4">
                <p className="text-sm font-medium text-ink">{row.feature}</p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: columns[1], val: row.agency },
                    { label: columns[2], val: row.freelancer },
                    { label: columns[3], val: row.kingdom, kingdom: true },
                  ].map(({ label, val, kingdom }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className={kingdom ? "font-semibold text-ink" : "text-muted"}>{label}</span>
                      {val ? (
                        <Check size={16} weight="bold" className={kingdom ? "text-cyan" : "text-gray-300"} />
                      ) : (
                        <XIcon size={16} className="text-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
