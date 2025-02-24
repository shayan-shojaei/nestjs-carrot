import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { IQueueProcessor } from './interfaces';
import {
  QUEUE_PROCESSOR_METADATA,
  QUEUE_PROCESSOR_PAYLOAD_TYPE_METADATA,
} from './decorators';
import { CarrotService } from './carrot.service';
import { QueueProcessorPayloadType } from './types';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class ProcessorExplorer implements OnModuleInit {
  /**
   * A map of queue name to processor instances.
   */
  private readonly processors = new Map<string, IQueueProcessor[]>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly carrotService: CarrotService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.explore();
    await this.setupConsumers();
  }

  private explore(): void {
    const discoveredProcessors = this.discoveryService
      .getProviders()
      .filter((provider) => {
        return (
          provider.metatype &&
          this.reflector.get<string>(
            QUEUE_PROCESSOR_METADATA,
            provider.metatype,
          )
        );
      });

    for (const instanceWrapper of discoveredProcessors) {
      const queue = this.reflector.get<string>(
        QUEUE_PROCESSOR_METADATA,
        instanceWrapper.metatype!, // metatype is never null here
      );
      if (!queue) {
        continue;
      }
      if (!this.processors.has(queue)) {
        this.processors.set(queue, []);
      }
      this.processors.get(queue)!.push(instanceWrapper.instance);
    }
  }

  private async setupConsumers(): Promise<void> {
    const channel = this.carrotService.getConsumerChannel(
      Array.from(this.processors.keys()),
    );

    await Promise.all(
      Array.from(this.processors.entries()).map(async ([queue, processors]) =>
        this.consume(channel, queue, processors),
      ),
    );
  }

  private async consume(
    channel: ChannelWrapper,
    queue: string,
    processors: IQueueProcessor[],
  ): Promise<void> {
    // TODO: handle ack/nack/requeue
    await channel.consume(
      queue,
      async (message) => {
        try {
          await Promise.all(
            processors.map(async (processor) => {
              const payloadType = this.reflector.get<QueueProcessorPayloadType>(
                QUEUE_PROCESSOR_PAYLOAD_TYPE_METADATA,
                processor.constructor,
              );

              // Content is a buffer by default but could be converted
              // to a string or JSON object based (any) on the payload
              // type.
              let payload: Buffer | string | any = message.content;

              switch (payloadType) {
                case 'string':
                  payload = message.content.toString();
                  break;
                case 'json':
                  payload = JSON.parse(message.content.toString());
                  break;
                default:
                  break;
              }

              return processor.process(payload);
            }),
          );
        } catch (error) {
          console.error(error);
        }
      },
      {
        noAck: true,
      },
    );
  }
}
