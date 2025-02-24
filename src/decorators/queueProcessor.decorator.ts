import { QueueProcessorOptions } from '../types';

export const QUEUE_PROCESSOR_METADATA = Symbol('QUEUE_PROCESSOR_METADATA');
export const QUEUE_PROCESSOR_PAYLOAD_TYPE_METADATA = Symbol(
  'QUEUE_PROCESSOR_PAYLOAD_TYPE_METADATA',
);

/**
 * Decorator to mark a class as a queue processor.
 *
 * @param queue The queue name to listen to.
 * @param options {QueueProcessorOptions} Additional options.
 * @param options.type The payload type to convert the message to. Default is JSON.
 * @constructor
 */
export const QueueProcessor = (
  queue: string,
  options?: QueueProcessorOptions,
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(QUEUE_PROCESSOR_METADATA, queue, target);
    Reflect.defineMetadata(
      QUEUE_PROCESSOR_PAYLOAD_TYPE_METADATA,
      options?.type || 'json',
      target,
    );
  };
};
