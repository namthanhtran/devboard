import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request-dto';
import { UpdateRequestDto } from './dto/update-request-dto';
import { replaceVariables } from './helpers/variable-replacer';
import Variable from 'common/types/Variables';
import axios from 'axios';

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

  async send(userId: number, requestId: number) {
    const request = await this.verifyRequestOwner(userId, requestId);
    const projectId = request.collection.project.id;

    const environment = await this.prismaService.environment.findFirst({
      where: { projectId, isActive: true },
    });

    const variables = (environment?.variables ?? []) as unknown as Variable[];
    const url = replaceVariables(request.url, variables);

    const startTime = Date.now();

    try {
      const response = await axios({
        method: request.method,
        url,
        headers: (request.headers as Record<string, string>) || {},
        data: request.method === 'GET' ? undefined : request.body,
      });
      const duration = Date.now() - startTime;

      await this.prismaService.requestHistory.create({
        data: {
          requestId,
          statusCode: response.status,
          responseBody: JSON.stringify(response.data),
          responseHeaders: response.headers as any,
          duration,
        },
      });

      return {
        statusCode: response.status,
        responseBody: response.data,
        responseHeaders: response.headers,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      await this.prismaService.requestHistory.create({
        data: {
          requestId,
          statusCode: error?.response?.status || 0,
          responseBody: JSON.stringify(
            error?.response?.data || error?.message || '',
          ),
          responseHeaders: error?.response?.headers || {},
          duration,
        },
      });

      return {
        statusCode: error?.response?.status || 0,
        responseBody: error?.response?.data || error?.message || '',
        responseHeaders: error?.response?.headers || {},
        duration,
      };
    }
  }

  async getHistory(userId: number, requestId: number) {
    await this.verifyRequestOwner(userId, requestId);
    return this.prismaService.requestHistory.findMany({
      where: { requestId },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
  }
}
