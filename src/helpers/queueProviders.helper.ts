import { Provider } from '@nestjs/common';
import { CarrotService } from '../carrot.service';
import { CARROT_CHANNEL } from '../constants';

export class QueueProvidersHelper {
  static createProvider(queueNames: string[]): Provider {
    return {
      provide: CARROT_CHANNEL,
      useFactory: (carrotService: CarrotService) => {
        return carrotService.getPublisherChannel(queueNames);
      },
      inject: [CarrotService],
    };
  }
}
