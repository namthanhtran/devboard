import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnvironmentDto } from './dto/create-environments.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

@Injectable()
export class EnvironmentsService {
  constructor(private prismaService: PrismaService) {}
  async verifyProjectOwner(userId: number, projectId: number) {
    const project = await this.prismaService.project.findUnique({
      where: {
        userId,
        id: projectId,
      },
    });
    if (!project) {
      throw new NotFoundException('Record not found!');
    }
    return project;
  }

  async findAll(userId: number, projectId: number) {
    await this.verifyProjectOwner(userId, projectId);
    return this.prismaService.environment.findMany({
      where: { projectId },
    });
  }

  async findOne(userId: number, projectId: number, environmentId: number) {
    await this.verifyProjectOwner(userId, projectId);
    const environment = await this.prismaService.environment.findUnique({
      where: { id: environmentId },
    });
    if (!environment) {
      throw new NotFoundException('Record not found!');
    }
    return environment;
  }

  async create(
    userId: number,
    projectId: number,
    createEnvironmentDto: CreateEnvironmentDto,
  ) {
    await this.verifyProjectOwner(userId, projectId);
    return this.prismaService.environment.create({
      data: {
        projectId,
        ...createEnvironmentDto,
      },
    });
  }

  async update(
    userId: number,
    projectId: number,
    environmentId: number,
    updateEnvironmentDto: UpdateEnvironmentDto,
  ) {
    await this.findOne(userId, projectId, environmentId);
    return this.prismaService.environment.update({
      where: {
        id: environmentId,
      },
      data: updateEnvironmentDto,
    });
  }

  async remove(userId: number, projectId: number, environmentId: number) {
    await this.findOne(userId, projectId, environmentId);
    return this.prismaService.environment.delete({
      where: { id: environmentId },
    });
  }
}
