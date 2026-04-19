import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection, Project } from '@prisma/client';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private prismaService: PrismaService) {}

  async verifyProjectOwner(
    userId: number,
    projectId: number,
  ): Promise<Project> {
    const project = await this.prismaService.project.findFirst({
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

  async findAll(userId: number, projectId: number): Promise<Collection[]> {
    const project = await this.verifyProjectOwner(userId, projectId);
    return this.prismaService.collection.findMany({
      where: {
        projectId: project.id,
      },
    });
  }

  async findOne(userId: number, projectId: number, collectionId: number) {
    await this.verifyProjectOwner(userId, projectId);
    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: collectionId,
      },
    });
    if (!collection) throw new NotFoundException('Record not found!');
    return collection;
  }

  async create(
    userId: number,
    projectId: number,
    collectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    await this.verifyProjectOwner(userId, projectId);
    return this.prismaService.collection.create({
      data: {
        order: 0,
        projectId,
        ...collectionDto,
      },
    });
  }

  async update(
    userId: number,
    projectId: number,
    collectionId: number,
    collectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    await this.verifyProjectOwner(userId, projectId);
    const collection = await this.findOne(userId, projectId, collectionId);
    return this.prismaService.collection.update({
      where: { id: collection.id },
      data: collectionDto,
    });
  }

  async remove(userId: number, projectId: number, collectionId: number) {
    await this.verifyProjectOwner(userId, projectId);
    await this.findOne(userId, projectId, collectionId);
    return this.prismaService.collection.delete({
      where: { id: collectionId },
    });
  }
}
