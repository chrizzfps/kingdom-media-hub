"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { getPublishHistory, publishDraft, rollbackToLog } from "@/lib/cms/actions";

type HistoryRow = { id: number; note: string | null; published_at: string };

export function PublishPanel() {
  const [pending, startTransition] = useTransition();
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const loadHistory = useCallback(() => {
    getPublishHistory().then(setHistory).catch(() => {});
  }, []);

  useEffect(loadHistory, [loadHistory]);

  function handlePublish() {
    startTransition(async () => {
      const res = await publishDraft(note);
      if (res.ok) {
        setNote("");
        setMessage({ tone: "ok", text: "Publicado. Ahora ejecuta npm run build y sube la carpeta out/ al servidor." });
        loadHistory();
      } else {
        setMessage({ tone: "error", text: res.error });
      }
    });
  }

  function handleRollback(id: number) {
    if (!confirm(`¿Restaurar la versión #${id}? Se registra como una publicación nueva con ese contenido.`)) return;
    startTransition(async () => {
      const res = await rollbackToLog(id);
      if (res.ok) {
        setMessage({ tone: "ok", text: `Versión #${id} restaurada. Recompila y sube out/ para verla en la web.` });
        loadHistory();
      } else {
        setMessage({ tone: "error", text: res.error });
      }
    });
  }

  return (
    <>
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Publicar</h2>
        <p className="mt-1 text-xs text-gray-500">
          Revisa antes con «Preview» en el menú. Publicar congela el borrador actual como la versión oficial.
        </p>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota de esta publicación (opcional)"
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
        <button
          onClick={handlePublish}
          disabled={pending}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Publicando…" : "Publicar cambios"}
        </button>
        {message && (
          <p className={`mt-3 text-sm ${message.tone === "ok" ? "text-emerald-600" : "text-red-500"}`}>
            {message.text}
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Historial</h2>
        <ul className="mt-3 divide-y divide-gray-100">
          {history.map((h, i) => (
            <li key={h.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">
                  #{h.id}
                  {i === 0 && <span className="ml-2 text-xs font-normal text-cyan-600">publicada</span>}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(h.published_at).toLocaleString("es-VE")}
                  {h.note ? ` — ${h.note}` : ""}
                </p>
              </div>
              {i !== 0 && (
                <button
                  onClick={() => handleRollback(h.id)}
                  disabled={pending}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  Restaurar
                </button>
              )}
            </li>
          ))}
          {history.length === 0 && <li className="py-3 text-sm text-gray-400">Sin publicaciones aún.</li>}
        </ul>
      </section>
    </>
  );
}
