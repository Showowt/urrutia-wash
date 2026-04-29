"use client";

// ═══════════════════════════════════════════════════════
// DataTable — Reusable admin data table
// Typed columns, sortable headers, responsive scroll,
// empty state, loading skeleton, action slots.
// Server Component (no client state — sorting handled
// by parent if needed, pass sorted data in).
// ═══════════════════════════════════════════════════════

export type ColumnAlign = "left" | "center" | "right";

export interface Column<T> {
  key: string;
  header: string;
  align?: ColumnAlign;
  width?: string; // e.g. "w-32", "w-48"
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  loading?: boolean;
  caption?: string;
  onRowClick?: (row: T) => void;
}

const ALIGN_CLASSES: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded animate-pulse"
            style={{
              background: "rgba(255,255,255,0.06)",
              width: i === 0 ? "60%" : i % 2 === 0 ? "80%" : "50%",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  emptyMessage = "No data found.",
  loading = false,
  caption,
}: DataTableProps<T>) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #1B2236",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" aria-label={caption}>
          {caption && <caption className="sr-only">{caption}</caption>}

          {/* ── Head ── */}
          <thead>
            <tr style={{ borderBottom: "1px solid #1B2236" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-mono tracking-widest uppercase whitespace-nowrap ${
                    ALIGN_CLASSES[col.align ?? "left"]
                  } ${col.width ?? ""}`}
                  style={{ color: "#8B95A8" }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm"
                  style={{ color: "#8B95A8" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={keyExtractor(row)}
                  className="transition-colors"
                  style={{
                    borderTop:
                      idx > 0 ? "1px solid rgba(27,34,54,0.6)" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      "rgba(0,180,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      "transparent";
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm whitespace-nowrap ${
                        ALIGN_CLASSES[col.align ?? "left"]
                      } ${col.width ?? ""}`}
                      style={{ color: "#F5F7FA" }}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
