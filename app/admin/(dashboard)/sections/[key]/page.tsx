import { notFound } from "next/navigation";
import { getSection, getSectionDraft } from "@/lib/cms/draft";
import { SectionEditor } from "./section-editor";

export default async function SectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const section = await getSection(key);
  if (!section) notFound();

  const { fields, items } = await getSectionDraft(key);

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <SectionEditor section={section} initialFields={fields} initialItems={items} />
    </div>
  );
}
