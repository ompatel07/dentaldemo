"use client";

import dynamic from "next/dynamic";

/** WebGL only, so it is kept out of the server render. */
const StudioSphere = dynamic(() => import("./StudioSphere"), { ssr: false, loading: () => null });

export function StudioBake() {
  return <StudioSphere />;
}
