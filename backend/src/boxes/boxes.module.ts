import { Module } from '@nestjs/common';
import { BoxesGateway } from './boxes.gateway';

@Module({
  providers: [BoxesGateway],
})
export class BoxesEventModule {}
