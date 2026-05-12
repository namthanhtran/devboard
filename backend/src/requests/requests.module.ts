import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RequestActionsController } from './request-actions.controller';

@Module({
  controllers: [RequestsController, RequestActionsController],
  providers: [RequestsService],
})
export class RequestsModule {}
