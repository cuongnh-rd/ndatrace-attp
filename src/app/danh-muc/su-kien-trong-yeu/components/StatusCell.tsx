"use client";

import { Tag } from "@/components/txng/ui";
import { vMain, vScheduled, vDraft, STATUS_META, fmtDate, type Cte } from "@/lib/txng/cte";

export default function StatusCell({ c }: { c: Cte }) {
    const m = vMain(c), sch = vScheduled(c), dr = vDraft(c);
    const meta = STATUS_META[m.status];
    return (
        <div className="flex flex-col items-start gap-1">
            <Tag cls={meta.cls}>
                {meta.label}
                {m.status === "scheduled" && ` — ${fmtDate(m.effectiveFrom)}`}
                {m.status === "superseded" && ` — ${fmtDate(m.effectiveTo)}`}
            </Tag>
            {m.status === "superseded" && m.replacedBy && <span className="text-[12px] text-gray-400">Thay thế bởi v{m.replacedBy}</span>}
            {m !== sch && sch && <Tag cls={STATUS_META.scheduled.cls}>v{sch.v} Chờ áp dụng — {fmtDate(sch.effectiveFrom)}</Tag>}
            {m !== dr && dr && <span className="text-[12px] text-gray-400">Đang soạn v{dr.v}</span>}
        </div>
    );
}
