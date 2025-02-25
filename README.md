# Carrot 🥕

A NestJS package that provides a RabbitMQ-based queue system, inspired by [@nestjs/bullmq](https://github.com/nestjs/bull). This package allows you to easily integrate RabbitMQ into your NestJS application for background job processing, task scheduling, and message queuing.

## Installation

```bash
npm install nestjs-carrot
```

## Usage

### Importing the Module

```typescript
import { Module } from '@nestjs/common';
import { RabbitMQModule } from 'nestjs-carrot';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      url: ['amqp://127.0.0.1:5672'], // RabbitMQ connection URL(s)
      global: true, // Whether to create a global connection
    }),
  ],
})
export class AppModule {}
```

### Queue Processors

Create a queue processor by decorating a class with the `QueueProcessor` decorator. The decorator takes a required argument, the name of the queue to process jobs from; and an optional argument to specify whether the payload
should be parsed as JSON, string or buffer.

```typescript
import { QueueProcessor, IQueueProcessor } from 'nestjs-carrot';

@QueueProcessor('my-queue', { type: 'json' }) // or 'string' or 'buffer'
export class MyQueueProcessor implements IQueueProcessor {
  async process(job: Job) {
    console.log(job.data);
  }
}
```

You also need to register the queue processor in your module.

```typescript
import { Module } from '@nestjs/common';
import { MyQueueProcessor } from './my-queue.processor';

@Module({
  providers: [MyQueueProcessor],
})
export class SomeModule {}
```

### Queue Producers

Import the channel provider and use it to send messages to a queue, specifying the queue names, which would be used to assert the queues
and creating the channel.

```typescript
import { Module } from '@nestjs/common';
import { CarrotModule } from 'nestjs-carrot';

@Module({
  imports: [
    CarrotModule.forFeature('my-queue', 'another-queue'),
  ],
})
export class SomeModule {}
```

Then inject the provider and use it to send messages to the queue.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectChannel } from 'nestjs-carrot';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class SomeService {
  constructor(@InjectChannel() private readonly channel: ChannelWrapper) {}

  async sendMessage() {
    await this.channel.sendToQueue('my-queue', { message: 'Hello, World!' });
  }
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
