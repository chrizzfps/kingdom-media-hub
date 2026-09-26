import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

const CELL_SPAN = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "sm:col-span-2 lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
];

export function MediaLab() {
  const t = useTranslations("mediaLab");
  const tf = useTranslations("mediaLab.filters");
  const projects = t.raw("projects") as Array<{
    id: string; title: string; category: string;
    metric: string; metricLabel: string; description: string;
    imageUrl?: string; imageAlt?: string;
  }>;

  return (
    <section id="media-lab" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.slice(0, 4).map((project, i) => (
            <Reveal key={project.id} delay={i * 0.07} className={`h-full ${CELL_SPAN[i]}`}>
              <GlassCard className="group h-full min-h-[240px] overflow-hidden p-0">
                <ProjectCard
                  project={project}
                  categoryLabel={project.category ? tf(project.category) : undefined}
                  large={i === 0}
                />
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  categoryLabel,
  large = false,
}: {
  project: {
    title: string; metric: string; metricLabel: string; description: string;
    imageUrl?: string; imageAlt?: string;
  };
  categoryLabel?: string;
  large?: boolean;
}) {
  return (
    <div className={`relative flex h-full w-full flex-col justify-end ${large ? "min-h-[320px] lg:min-h-[460px]" : "min-h-[240px]"} bg-slate-900 overflow-hidden`}>
      {/* Photo with hover zoom — uploaded from /admin (Supabase Storage) */}
      {project.imageUrl && (
        <Image
          src={project.imageUrl}
          alt={project.imageAlt || project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* Persistent gradient overlay for contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/10 transition-opacity duration-300 group-hover:opacity-75" />

      {/* Metric details visible on hover */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="font-display font-extrabold tabular-nums text-cyan" style={{ fontSize: large ? "4rem" : "2.75rem", lineHeight: 1 }}>
          {project.metric}
        </p>
        <p className="mt-2 text-sm font-semibold text-white">{project.metricLabel}</p>
        <p className="mt-3 max-w-[220px] text-xs text-slate-300 leading-relaxed">{project.description}</p>
      </div>

      {/* Bottom label */}
      <div className="relative z-10 p-5 sm:p-6">
        <p className="font-display text-base font-bold text-white tracking-tight">{project.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
          {categoryLabel && <span>{categoryLabel}</span>}
          <span className="font-semibold tabular-nums text-cyan">{project.metric}</span>
        </div>
      </div>
    </div>
  );
}
