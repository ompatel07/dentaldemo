import type { Metadata } from "next";
import { StudioBake } from "@/components/hero/StudioBake";

export const metadata: Metadata = {
  title: "Matcap bake",
  robots: { index: false, follow: false },
};

/**
 * Not a page for visitors: this is the subject scripts/bake-matcap.mjs
 * photographs to light the hero molar. See components/hero/StudioSphere.tsx.
 */
export default function MatcapPage() {
  return (
    <main id="main" className="grid min-h-svh place-items-center pt-[var(--nav-h)]">
      <StudioBake />
    </main>
  );
}
