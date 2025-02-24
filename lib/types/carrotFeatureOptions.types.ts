import { AmqpConnectionManagerOptions } from 'amqp-connection-manager';

export type CarrotModuleOptions = {
  /**
   * amqp connection uri
   *
   * @example amqp://127.0.0.1:5672
   */
  uri: string[];

  /**
   * TODO: add queue prefix feature
   *
   * queue prefix
   *
   * Prefixes all queue names with the given string.
   *
   * @example myapp.<queue-name>
   */
  // queuePrefix?: string;

  /**
   * connection options
   */
  connectionOptions?: AmqpConnectionManagerOptions;

  /**
   * global flag
   *
   * If set to true, the module will be registered as a global module.
   */
  global?: boolean;
};
