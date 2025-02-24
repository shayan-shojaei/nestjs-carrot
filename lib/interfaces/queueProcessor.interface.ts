export interface IQueueProcessor {
  process(data: Buffer | string | unknown): Promise<void> | void;
}
