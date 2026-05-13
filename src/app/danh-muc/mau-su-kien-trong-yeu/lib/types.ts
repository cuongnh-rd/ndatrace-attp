export type CteStatus = "Nháp" | "Hoạt động" | "Không hoạt động";
export type AuthorityLevel = "Ministry" | "Provincial";

export interface KdeCteMapping {
    id: string;
    event_id: string;
    kde_id: string;
    kde_code: string;
    kde_name: string;
    kde_data_type: string;
    kde_version: number;
    kde_current_version: number;
    display_order: number;
    is_required: boolean;
    note: string;
}

export interface CteEvent {
    id: string;
    template_id: string;
    event_code: string;
    event_name: string;
    display_order: number;
    kde_mappings: KdeCteMapping[];
}

export interface CteTemplate {
    id: string;
    vc_type: string;
    vc_type_name: string;
    family_id: string | null;
    family_name: string;
    authority_level: AuthorityLevel;
    version: number;
    status: CteStatus;
    description: string;
    cloned_from_id: string | null;
    events: CteEvent[];
    updated_at: string;
    created_by: string;
}

export interface CteVersionHistory {
    id: string;
    template_id: string;
    version: number;
    snapshot_events: CteEvent[];
    status: "Active" | "Superseded";
    created_by: string;
    created_at: string;
}

export interface KdeLibraryItem {
    id: string;
    code: string;
    name: string;
    data_type: string;
    current_version: number;
    status: "Hoạt động" | "Ngừng hoạt động" | "Nháp";
    description: string;
}

export interface L1EventKde {
    kde_id: string;
    kde_code: string;
    kde_name: string;
    kde_data_type: string;
    kde_version: number;
    is_required: boolean;
}

export interface L1Event {
    event_code: string;
    event_name: string;
    kdes: L1EventKde[];
}

export interface L1Template {
    id: string;
    code: string;
    name: string;
    family_name: string;
    version: number;
    events: L1Event[];
}

export interface CteNotification {
    id: string;
    template_id: string;
    template_name: string;
    family_name: string;
    old_version: number;
    new_version: number;
    affected_portals: string[];
    created_at: string;
    is_read: boolean;
}
