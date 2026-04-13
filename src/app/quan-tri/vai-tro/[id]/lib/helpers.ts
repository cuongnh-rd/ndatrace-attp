import type { DataScopeState, PartnerScope, AgencyMode } from "./types";
import { scopeCompanies, scopePartners } from "@/lib/mock-data";

export function getPartnerCompanies(partnerId: string) {
    return scopeCompanies.filter((c) => c.doi_tac_id === partnerId);
}

export function computePreviewCount(scope: DataScopeState): number {
    return scopeCompanies.filter((c) => {
        if (scope.agencyType === "specific") {
            const ps = scope.partnerScopes[c.doi_tac_id];
            if (!ps) return false;
            if (ps.mode === "exclude" && ps.excludeList.includes(c.id)) return false;
            if (ps.mode === "allow_only" && !ps.allowList.includes(c.id)) return false;
        }
        if (scope.regionType === "specific" && !scope.selectedProvinces.includes(c.province)) return false;
        if (scope.categoryType === "specific" && !scope.selectedCategories.includes(c.category_id)) return false;
        return true;
    }).length;
}

export function getModeLabel(ps: PartnerScope, totalDn: number): string {
    if (ps.mode === "allow_all") return `${totalDn}/${totalDn}`;
    if (ps.mode === "exclude") return `${totalDn - ps.excludeList.length}/${totalDn} (−${ps.excludeList.length})`;
    return `${ps.allowList.length}/${totalDn}`;
}
