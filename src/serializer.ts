/**
 * Serializes async tasks through a single promise chain: each task starts only
 * after the previous one settles, so overlapping read-modify-write operations
 * cannot interleave. A rejected task neither poisons the chain (later tasks
 * still run) nor is swallowed (its own caller receives the rejection).
 */
export class Serializer {
  private queue: Promise<unknown> = Promise.resolve();

  run<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task, task);
    this.queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}
