import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dtos/controllers/createCategory.dto';

const prisma = new PrismaService();

@Injectable()
export class CategoriesService {
  async findAll() {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(params: CreateCategoryDto, userId: number) {
    const { name, parentCategoryId } = params;

    if (
      await prisma.category.findUnique({
        where: {
          name,
        },
      })
    )
      throw new ConflictException('Manufacturer name already exists');

    return await prisma.category.create({
      data: {
        name,
        parentCategory: parentCategoryId && {
          connect: {
            id: parentCategoryId,
          },
        },
        createdByUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
