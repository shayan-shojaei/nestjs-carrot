export type QueueProcessorPayloadType = 'json' | 'buffer' | 'string';

/**
 * Options for the queue processor.
 *
 * @param type The payload type to convert the message to. Default is JSON.
 */
export type QueueProcessorOptions = {
  type?: QueueProcessorPayloadType;
};
