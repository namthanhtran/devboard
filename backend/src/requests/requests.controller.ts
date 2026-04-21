import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type AuthUser from 'common/types/AuthUser';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateRequestDto } from './dto/create-request-dto';
import { RequestsService } from './requests.service';
import { UpdateRequestDto } from './dto/update-request-dto';

@Controller('collections/:collectionId/requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('collectionId') collectionId: string,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestService.create(user.id, +collectionId, createRequestDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Param('collectionId') collectionId: string,
  ) {
    return this.requestService.findAll(user.id, +collectionId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.requestService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return this.requestService.update(
      user.id,
      +collectionId,
      +id,
      updateRequestDto,
    );
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('collectionId') collectionId: string,
    @Param('id') id: string,
  ) {
    return this.requestService.remove(user.id, +collectionId, +id);
  }
}
