import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import type AuthUser from 'common/types/AuthUser';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('projects/:projectId/collections')
export class CollectionsController {
  constructor(private collectionService: CollectionsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Body() collectionDto: CreateCollectionDto,
  ) {
    return this.collectionService.create(user.id, +projectId, collectionDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.collectionService.findAll(user.id, +projectId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.collectionService.findOne(user.id, +projectId, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() collection: UpdateCollectionDto,
  ) {
    return this.collectionService.update(user.id, +projectId, +id, collection);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.collectionService.remove(user.id, +projectId, +id);
  }
}
