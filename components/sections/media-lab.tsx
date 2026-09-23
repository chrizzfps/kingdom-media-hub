import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

export function MediaLab() {
  const t = useTranslations("mediaLab");
  const projects = t.raw("projects") as Array<{
    id: string; title: string; category: string;
    metric: string; metricLabel: string; description: string;
    imageUrl?: string; imageAlt?: string;
  }>;

  return (
    <section id="media-lab" className="bg-section-alt py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />

        {/* Asymmetric grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Hero project — spans 2 rows on desktop */}
          <Reveal className="h-full lg:row-span-2">
            <GlassCard className="group h-full min-h-[320px] overflow-hidden p-0 lg:min-h-[460px]">
              <ProjectCard project={projects[0]} large />
            </GlassCard>
          </Reveal>

          {projects.slice(1).map((project, i) => (
            <Reveal key={project.id} delay={i * 0.07} className="h-full">
              <GlassCard className="group h-full min-h-[220px] overflow-hidden p-0">
                <ProjectCard project={project} />
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
  large = false,
}: {
  project: {
    title: string; category?: string; metric: string; metricLabel: string; description: string;
    imageUrl?: string; imageAlt?: string;
  };
  large?: boolean;
}) {
  return (
    <div className={`relative flex h-full w-full flex-col justify-end ${large ? "min-h-[320px] lg:min-h-[460px]" : "min-h-[220px]"} bg-slate-900 overflow-hidden`}>
      {/* Category Pill Badge */}
      {project.category && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-block rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-semibold tracking-widest text-cyan uppercase border border-white/15 shadow-sm">
            {project.category}
          </span>
        </div>
      )}

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
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm p-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="font-display font-extrabold text-cyan drop-shadow-[0_0_15px_rgba(51,204,255,0.4)]" style={{ fontSize: large ? "4rem" : "2.75rem", lineHeight: 1 }}>
          {project.metric}
        </p>
        <p className="mt-2 text-sm font-bold text-white tracking-wide uppercase">{project.metricLabel}</p>
        <p className="mt-3 max-w-[220px] text-xs text-slate-300 leading-relaxed">{project.description}</p>
      </div>

      {/* Bottom label */}
      <div className="relative z-10 p-5 sm:p-6">
        <p className="font-display text-base font-bold text-white tracking-tight drop-shadow-md">{project.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-cyan">{project.metric}</span>
          <span className="text-xs text-slate-300">{project.metricLabel}</span>
        </div>
      </div>
    </div>
  );
}
