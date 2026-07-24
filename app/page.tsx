import { redirect } from "next/navigation";

/**
 * Static export has no middleware/proxy, so the "/" -> "/en" hop that
 * proxy.ts handles in a Node deployment can't run here. This page ships a
 * meta-refresh + script fallback baked into the static HTML instead.
 */
export default function RootPage() {
  redirect("/en");
}
