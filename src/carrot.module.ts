import { DynamicModule, Module } from '@nestjs/common';
import { CarrotService } from './carrot.service';
import { QueueProvidersHelper } from './helpers';
import { ProcessorExplorer } from './processor.explorer';
import { CarrotModuleOptions } from './types';
import { CARROT_MODULE_OPTIONS } from './constants';
import { DiscoveryModule, Reflector } from '@nestjs/core';

@Module({})
export class CarrotModule {
  static forRoot(options: CarrotModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: CARROT_MODULE_OPTIONS,
      useValue: options,
    };
    return {
      global: options.global,
      module: CarrotModule,
      imports: [DiscoveryModule],
      providers: [CarrotService, ProcessorExplorer, optionsProvider, Reflector],
      exports: [optionsProvider],
    };
  }

  /**
   * Inject the channel provider and register a set
   * of queue names to be initialized upon module import.
   */
  static forFeature(...queueNames: string[]): DynamicModule {
    const provider = QueueProvidersHelper.createProvider(queueNames);
    return {
      module: CarrotModule,
      providers: [CarrotService, provider],
      exports: [provider],
    };
  }
}
