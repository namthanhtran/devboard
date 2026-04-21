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
import { CreateEnvironmentDto } from './dto/create-environments.dto';
import { EnvironmentsService } from './environments.service';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

@Controller('projects/:projectId/environments')
export class EnvironmentsController {
  constructor(private environmentService: EnvironmentsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Body() createEnvironmentDto: CreateEnvironmentDto,
  ) {
    return this.environmentService.create(
      user.id,
      +projectId,
      createEnvironmentDto,
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.environmentService.findAll(user.id, +projectId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.environmentService.findOne(user.id, +projectId, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ) {
    return this.environmentService.update(
      user.id,
      +projectId,
      +id,
      updateEnvironmentDto,
    );
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.environmentService.remove(user.id, +projectId, +id);
  }
}
