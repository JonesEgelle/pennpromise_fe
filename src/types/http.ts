/**
 * The single shared HTTP contract for the app. Every service returns one of
 * these shapes. Do NOT redefine `IResponse` / `Paginator` inside a module —
 * dgtool_fe drifted this way and the copies fell out of sync.
 *
 * NOTE: field names below are inferred from the sibling project's backend and
 * are NOT confirmed against PennPromise's API. Validate against the real
 * OpenAPI spec before relying on them (see CLAUDE.md "Guardrails").
 */

/** Standard API envelope. */
export interface IResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

/** Server-side pagination metadata. Pagination is ALWAYS server-driven. */
export interface Paginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** A paginated payload as it sits inside `IResponse.data`. */
export interface PaginatedData<T> {
  results: T[];
  pagination: Paginator;
}

/** Convenience alias for a fully-wrapped paginated response. */
export type PaginatedResponse<T> = IResponse<PaginatedData<T>>;

/** Common query params accepted by list endpoints. */
export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}
