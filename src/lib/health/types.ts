export type Sev = "critical" | "high" | "medium";

export interface HCard {
  id: string;
  /** Nhãn */
  l: string;
  /** Giá trị (tử số nếu là tỉ lệ) */
  v: number | string;
  /** Thay đổi so với cùng kỳ tháng trước (% hoặc điểm %) */
  t: number;
  k: "core" | "scale" | "risk";
  /** Mẫu số – có thì card là tỉ lệ */
  d?: number;
  /** Cách tính */
  f?: string;
  /** Tăng là xấu */
  bad?: number;
  /** Mục tiêu (%) cho chỉ số tỉ lệ */
  goal?: number;
}

export type Series = [string, number[], string?];

export interface Chart {
  id: string;
  t: string;
  f: string;
  type: "ratio" | "hbar" | "bar" | "line" | "pie" | "doughnut" | "stack" | "combo" | "waterfall" | "cohort";
  for?: string[];
  labels?: string[];
  ds?: Series[];
  pct?: number;
  y2pct?: number;
  y2free?: number;
  y?: number;
  y_free?: number;
  items?: [string, number, number][];
  steps?: [string, number, string?][];
  rows?: [string, number[]][];
  cols?: string[];
}

export interface Warn {
  /** Các health card mà cảnh báo này tác động */
  for?: string[];
  t: string;
  sev: Sev;
  n: number;
  cols: string[];
  rows: (string | number)[][];
}

export interface Mod {
  k: string;
  g: string;
  t: string;
  d: string;
  href: string;
  cards: HCard[];
  charts: Chart[];
  warns: Warn[];
}

export interface Leader {
  t: string;
  f: string;
  cols: string[];
  rows: (string | number)[][];
}
