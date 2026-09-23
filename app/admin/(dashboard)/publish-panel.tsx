"use client";

import { useState, useTransition } from "react";
import { publishDraft, rollbackToLog } from "@/lib/cms/actions";

type HistoryRow = { id: number; note: string | null; published_at: string; published_by: string | null };

export function PublishPanel({ history }: { history: HistoryRow[] }) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handlePublish() {
    startTransition(async () => {
      const res = await publishDraft(note || undefined);
      setMessage(res.ok ? "Publicado. La web pública ya refleja estos cambios." : `Error: ${res.error}`);
      if (res.ok) setNote("");
    });
  }

  function handleRollback(id: number) {
    if (!confirm(`¿Restaurar la versión publicada #${id}? Esto crea una nueva publicación con ese contenido.`)) return;
    startTransition(async () => {
      const res = await rollbackToLog(id);
      setMessage(res.ok ? `Restaurado a la versión #${id}.` : `Error: ${res.error}`);
    });
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Publicar</h2>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota de esta publicación (opcional)"
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
        <button
          onClick={handlePublish}
          disabled={pending}
          className="mt-3 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Publicando…" : "Publicar cambios"}
        </button>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Historial de publicaciones</h2>
        <ul className="mt-3 divide-y divide-gray-100">
          {history.map((h, i) => (
            <li key={h.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">
                  #{h.id} {i === 0 && <span className="ml-1 text-xs font-normal text-cyan-600">(actual)</span>}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(h.published_at).toLocaleString("es-VE")} {h.note ? `— ${h.note}` : ""}
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
      </div>
    </div>
  );
}
