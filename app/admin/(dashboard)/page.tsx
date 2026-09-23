import { getPublishHistory } from "@/lib/cms/actions";
import { PublishPanel } from "./publish-panel";

export default async function AdminHomePage() {
  const history = await getPublishHistory();

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Panel de Kingdom</h1>
      <p className="mt-1 text-sm text-gray-500">
        Edita cada sección desde el menú de la izquierda. Los cambios se guardan como borrador de inmediato — la web
        pública no cambia hasta que publiques.
      </p>

      <PublishPanel history={history} />
    </div>
  );
}
