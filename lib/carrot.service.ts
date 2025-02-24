import { Inject, Injectable } from '@nestjs/common';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { CarrotModuleOptions } from './types';
import { CARROT_MODULE_OPTIONS } from './constants';

@Injectable()
export class CarrotService {
  private readonly connection: AmqpConnectionManager;

  constructor(
    @Inject(CARROT_MODULE_OPTIONS)
    private readonly options: CarrotModuleOptions,
  ) {
    this.connection = connect(this.options.url, this.options.connectionOptions);
  }

  getPublisherChannel(queueNames: string[]): ChannelWrapper {
    return this.getChannel('PUBLISHER_CHANNEL', queueNames);
  }

  getConsumerChannel(queueNames: string[]): ChannelWrapper {
    return this.getChannel('CONSUMER_CHANNEL', queueNames);
  }

  private getChannel(name: string, queues: string[]): ChannelWrapper {
    return this.connection.createChannel({
      name: name,
      json: true,
      setup: async (channel: ConfirmChannel) => {
        return Promise.all(
          queues.map((queue) =>
            channel.assertQueue(queue, {
              durable: true,
            }),
          ),
        );
      },
    });
  }
}
