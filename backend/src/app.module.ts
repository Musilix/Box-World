import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoxesEventModule } from './boxes/boxes.module';

@Module({
  imports: [BoxesEventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
