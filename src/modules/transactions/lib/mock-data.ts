/**
 * In-memory Transactions store + async adapter.
 *
 * TODO(api-contract): replace each `mock*` body with a `services/transactions.ts`
 * call over `apiClient`. Date-range filtering is stubbed (returns all) until the
 * real timestamp semantics are confirmed.
 */
import type {
  Transaction,
  TransactionCompliance,
  TransactionListParams,
  TransactionListResult,
  TransactionProduct,
} from "@/modules/transactions/types";

const CLIENTS = [
  { name: "John Doe", bvnMasked: "2221********918" },
  { name: "Fatima Yusuf", bvnMasked: "2119********704" },
  { name: "Musa Ibrahim", bvnMasked: "2280********155" },
  { name: "Aisha Farouk", bvnMasked: "2205********612" },
  { name: "Ibrahim Balarabe", bvnMasked: "2231********889" },
];
const PRODUCTS: TransactionProduct[] = [
  "bonds",
  "sukuk",
  "equity",
  "murabaha",
  "ijarah",
];
const COMPLIANCE: TransactionCompliance[] = [
  "cleared",
  "cleared",
  "flagged",
  "under_review",
  "blocked",
];

export interface TransactionInput {
  contractId: string;
  clientName: string;
  bvnMasked: string;
  product: TransactionProduct;
  amountNgn: number;
  compliance: TransactionCompliance;
}

function seed(): Transaction[] {
  return Array.from({ length: 54 }, (_, index) => {
    const client = CLIENTS[index % CLIENTS.length];
    return {
      id: `txn-${index + 1}`,
      contractId: `SK-${(67830000177 + index * 13).toString()}`,
      timestamp: new Date(
        Date.UTC(2026, 10, 23, 14, 22, 10) - index * 3_600_000,
      ).toISOString(),
      client: { ...client },
      product: PRODUCTS[index % PRODUCTS.length],
      amountNgn: 45_000_000 - (index % 9) * 3_250_000,
      compliance: COMPLIANCE[index % COMPLIANCE.length],
      updatedAt: "2026-09-01T10:00:00+01:00",
    };
  });
}

const store: Transaction[] = seed();

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockListTransactions(
  params: TransactionListParams,
): Promise<TransactionListResult> {
  await delay();
  const client = params.client.trim().toLowerCase();

  const filtered = store.filter((txn) => {
    if (params.compliance !== "all" && txn.compliance !== params.compliance) {
      return false;
    }
    if (params.product !== "all" && txn.product !== params.product) return false;
    if (params.amountMin !== null && txn.amountNgn < params.amountMin) {
      return false;
    }
    if (params.amountMax !== null && txn.amountNgn > params.amountMax) {
      return false;
    }
    if (!client) return true;
    return (
      txn.contractId.toLowerCase().includes(client) ||
      txn.client.name.toLowerCase().includes(client) ||
      txn.client.bvnMasked.includes(client)
    );
    // TODO(api-contract): dateRange filtering once timestamp semantics are known.
  });

  const count = filtered.length;
  const totalPages = Math.max(1, Math.ceil(count / params.pageSize));
  const page = Math.min(Math.max(1, params.page), totalPages);
  const start = (page - 1) * params.pageSize;

  return {
    results: filtered.slice(start, start + params.pageSize),
    pagination: {
      count,
      page,
      page_size: params.pageSize,
      total_pages: totalPages,
    },
  };
}

export async function mockCreateTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  await delay();
  const txn: Transaction = {
    id: `txn-${store.length + 1}`,
    contractId: input.contractId,
    timestamp: new Date().toISOString(),
    client: { name: input.clientName, bvnMasked: input.bvnMasked },
    product: input.product,
    amountNgn: input.amountNgn,
    compliance: input.compliance,
    updatedAt: new Date().toISOString(),
  };
  store.unshift(txn);
  return txn;
}

export async function mockUpdateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  await delay();
  const txn = store.find((entry) => entry.id === id);
  if (!txn) throw new Error("This transaction no longer exists.");
  txn.contractId = input.contractId;
  txn.client = { name: input.clientName, bvnMasked: input.bvnMasked };
  txn.product = input.product;
  txn.amountNgn = input.amountNgn;
  txn.compliance = input.compliance;
  txn.updatedAt = new Date().toISOString();
  return txn;
}

export async function mockDeleteTransaction(id: string): Promise<void> {
  await delay();
  const index = store.findIndex((entry) => entry.id === id);
  if (index >= 0) store.splice(index, 1);
}
