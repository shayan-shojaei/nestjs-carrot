import { Inject } from '@nestjs/common';
import { CARROT_CHANNEL } from '../constants';

export const InjectChannel = () => Inject(CARROT_CHANNEL);
