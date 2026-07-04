export type BatchItemResult = {
  id: string;
  status: "success" | "error";
  message?: string;
};

/**
 * Runs each item through the worker in submission order and reports a per-item
 * result. A worker rejection is reported against that item as an error and does
 * not abort the rest of the batch (partial-failure semantics).
 */
export const settleBatch = async <T extends { id: string }>(
  items: T[],
  worker: (item: T) => Promise<void>,
): Promise<BatchItemResult[]> => {
  const results: BatchItemResult[] = [];
  for (const item of items) {
    try {
      await worker(item);
      results.push({ id: item.id, status: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ id: item.id, status: "error", message });
    }
  }
  return results;
};
