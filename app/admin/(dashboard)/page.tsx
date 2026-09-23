import { PublishPanel } from "./publish-panel";
import { SectionOrder } from "./section-order";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Panel de Kingdom</h1>
      <p className="mt-1 text-sm text-gray-500">
        Los cambios se guardan como borrador al instante. La web no cambia hasta que publiques y vuelvas a subir el
        build.
      </p>
      <PublishPanel />
      <SectionOrder />
    </div>
  );
}
