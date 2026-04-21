import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request-dto';
import { UpdateRequestDto } from './dto/update-request-dto';

@Injectable()
export class RequestsService {
  constructor(private prismaService: PrismaService) {}

  async verifyCollectionOwner(userId: number, collectionId: number) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id: collectionId },
      include: { project: true },
    });
    if (!collection || collection.project.userId !== userId) {
      throw new NotFoundException('Record not found!');
    }

    return collection;
  }

  async verifyRequestOwner(userId: number, requestId: number) {
    const request = await this.prismaService.request.findUnique({
      where: { id: requestId },
      include: { collection: { include: { project: true } } },
    });
    if (!request || request.collection.project.userId !== userId) {
      throw new NotFoundException('Record not found!');
    }
    return request;
  }

  async findAll(userId: number, collectionId: number) {
    await this.verifyCollectionOwner(userId, collectionId);
    return this.prismaService.request.findMany({
      where: { collectionId },
    });
  }

  async findOne(userId: number, requestId: number) {
    return this.verifyRequestOwner(userId, requestId);
  }

  async create(
    userId: number,
    collectionId: number,
    createRequestDto: CreateRequestDto,
  ) {
    await this.verifyCollectionOwner(userId, collectionId);
    return this.prismaService.request.create({
      data: {
        order: 0,
        collectionId,
        ...createRequestDto,
      },
    });
  }

  async update(
    userId: number,
    collectionId: number,
    requestId: number,
    updateRequestDto: UpdateRequestDto,
  ) {
    await this.verifyCollectionOwner(userId, collectionId);
    const request = await this.findOne(userId, requestId);
    return this.prismaService.request.update({
      where: { id: request.id },
      data: {
        ...updateRequestDto,
      },
    });
  }

  async remove(userId: number, collectionId: number, requestId: number) {
    await this.verifyCollectionOwner(userId, collectionId);
    await this.findOne(userId, requestId);
    return this.prismaService.request.delete({
      where: { id: requestId },
    });
  }
}
