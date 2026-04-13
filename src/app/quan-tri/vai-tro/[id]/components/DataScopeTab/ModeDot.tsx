"use client";

import type { AgencyMode } from "../../lib/types";

function ModeDot({ mode }: { mode: AgencyMode }) {
    const color = mode === "allow_all" ? "bg-green-500" : mode === "exclude" ? "bg-amber-500" : "bg-blue-500";
    return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />;
}

export default ModeDot;
