import { SECTION_KEYS } from "@/lib/cms/section-keys";
import { SectionLoader } from "./section-loader";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTION_KEYS.map((key) => ({ key }));
}

export default async function SectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <SectionLoader sectionKey={key} />
    </div>
  );
}
