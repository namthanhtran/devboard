import { Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { RequestsService } from './requests.service';
import type AuthUser from 'common/types/AuthUser';

@Controller('requests')
export class RequestActionsController {
  constructor(private requestService: RequestsService) {}

  @Post(':id/send')
  send(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.requestService.send(user.id, +id);
  }

  @Get(':id/history')
  getHistory(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.requestService.getHistory(user.id, +id);
  }
}
