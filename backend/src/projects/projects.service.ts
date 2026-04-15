import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    userId: number,
    createProjectDto: CreateProjectDto,
  ): Promise<Project | null> {
    return this.prismaService.project.create({
      data: {
        ...createProjectDto,
        userId,
      },
    });
  }

  async findAll(userId: number): Promise<Project[]> {
    return this.prismaService.project.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, projectId: number): Promise<Project | null> {
    const project = await this.prismaService.project.findFirst({
      where: {
        userId,
        id: projectId,
      },
    });
    if (!project) throw new NotFoundException('Record not found!');
    return project;
  }

  async update(
    userId: number,
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project | null> {
    await this.findOne(userId, projectId);
    return this.prismaService.project.update({
      where: { id: projectId },
      data: updateProjectDto,
    });
  }

  async remove(userId: number, projectId: number) {
    await this.findOne(userId, projectId);
    return this.prismaService.project.delete({
      where: { id: projectId },
    });
  }
}
