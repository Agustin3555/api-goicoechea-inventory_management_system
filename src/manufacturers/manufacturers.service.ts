import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateManufacturerDto } from './dtos/controllers/createManufacturer.dto';
import { UpdateManufacturerDto } from './dtos/controllers/updateManufacturer.dto';

const prisma = new PrismaService();

@Injectable()
export class ManufacturersService {
  async findAll() {
    return await prisma.manufacturer.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findByName(name: string) {
    return await prisma.manufacturer.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        _count: true,
      },
    });
  }

  async create(params: CreateManufacturerDto, userId: number) {
    const { name } = params;

    if (
      await prisma.manufacturer.findUnique({
        where: {
          name,
        },
      })
    )
      throw new ConflictException('Manufacturer name already exists');

    return await prisma.manufacturer.create({
      data: {
        name,
        createdByUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(id: number, manufacturerParams: UpdateManufacturerDto) {
    const { name } = manufacturerParams;

    if (
      await prisma.manufacturer.findUnique({
        where: {
          name,
        },
      })
    )
      throw new ConflictException('Manufacturer name already exists');

    return await prisma.manufacturer.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }
}
