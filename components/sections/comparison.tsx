import { useTranslations } from "next-intl";
import { Check, X as XIcon, Lightning } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

interface ComparisonRow {
  feature: string;
  agency: boolean;
  freelancer: boolean;
  kingdom: boolean;
  highlight?: boolean;
}

export function Comparison() {
  const t = useTranslations("comparison");
  const columns = t.raw("columns") as string[];
  const comparisonRows = t.raw("rows") as ComparisonRow[];

  return (
    <section id="comparison" className="bg-section-alt py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          align="center"
          className="mb-12"
        />

        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-edge bg-white shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-edge">
              <div className="p-5" />
              {columns.slice(1).map((col, i) => (
                <div
                  key={col}
                  className={`p-5 text-center ${i === 2 ? "bg-cyan/5" : ""}`}
                >
                  {i === 2 ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2.5 py-1 font-mono text-xs font-semibold text-cyan">
                        <Lightning size={11} weight="fill" />
                        {t("badge")}
                      </span>
                      <p className="font-display text-sm font-bold text-ink">{col}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-muted">{col}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            {comparisonRows.map((row) => {
              return (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 border-b border-edge last:border-0 ${row.highlight ? "bg-gray-50/50" : ""}`}
                >
                  <div className="flex items-center p-4 pl-5">
                    <p className={`text-sm ${row.highlight ? "font-semibold text-ink" : "text-muted"}`}>
                      {row.feature}
                    </p>
                  </div>
                  {[row.agency, row.freelancer, row.kingdom].map((val, j) => (
                    <div
                      key={j}
                      className={`flex items-center justify-center p-4 ${j === 2 ? "bg-cyan/5" : ""}`}
                    >
                      {val ? (
                        <Check
                          size={18}
                          weight="bold"
                          className={j === 2 ? "text-cyan" : "text-gray-300"}
                        />
                      ) : (
                        <XIcon size={18} className="text-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
