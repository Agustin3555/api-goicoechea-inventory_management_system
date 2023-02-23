import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';
import { PrismaService } from 'src/prisma.service';
import {
  CreateProductDto,
  FindFieldsByNameDto,
  SearchForQuantityFieldSuggestionsDto,
  SearchForStringFieldSuggestionsDto,
} from './dtos/controllers';
import { SearchForFractionFieldSuggestionsDto } from './dtos/controllers/searchForFractionFieldSuggestions.dto';

const prisma = new PrismaService();

@Injectable()
export class ProductsService {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  async findAll() {
    return await prisma.product.findMany({
      include: {
        booleanFields: true,
        stringFields: true,
        quantityFields: true,
        fractionFields: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  async findByName(name: string) {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return products;
  }

  async findFieldsByName(params: FindFieldsByNameDto) {
    const { type, name } = params;

    const optionsQuery = {
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        name: true,
      },
      distinct: ['name'],
    };

    const queries = {
      BOOLEAN: async () =>
        await prisma.booleanProductField.findMany(
          optionsQuery as Prisma.BooleanProductFieldFindManyArgs,
        ),
      STRING: async () =>
        await prisma.stringProductField.findMany(
          optionsQuery as Prisma.StringProductFieldFindManyArgs,
        ),
      QUANTITY: async () =>
        await prisma.quantityProductField.findMany(
          optionsQuery as Prisma.QuantityProductFieldFindManyArgs,
        ),
      FRACTION: async () =>
        await prisma.fractionProductField.findMany(
          optionsQuery as Prisma.FractionProductFieldFindManyArgs,
        ),
    };

    return (await queries[type]()).map((field: { name: string }) => field.name);
  }

  async searchForStringFieldSuggestions(
    params: SearchForStringFieldSuggestionsDto,
  ) {
    const { name } = params;

    const fields = await prisma.stringProductField.findMany({
      where: {
        name,
      },
      select: {
        value: true,
      },
      distinct: ['value'],
    });

    return fields.map((field) => field.value);
  }

  async searchForQuantityFieldSuggestions(
    params: SearchForQuantityFieldSuggestionsDto,
  ) {
    const { name, valueType } = params;

    const queries = {
      VALUE: async () => {
        const fields = await prisma.quantityProductField.findMany({
          where: {
            name,
          },
          select: {
            value: true,
          },
          distinct: ['value'],
        });

        return fields.map((field) => field.value);
      },
      METRIC_UNIT: async () => {
        const fields = await prisma.quantityProductField.findMany({
          where: {
            name,
          },
          select: {
            metricUnit: true,
          },
          distinct: ['metricUnit'],
        });

        return fields.map((field) => field.metricUnit);
      },
    };

    return await queries[valueType]();
  }

  async searchForFractionFieldSuggestions(
    params: SearchForFractionFieldSuggestionsDto,
  ) {
    const { name, valueType } = params;

    const queries = {
      NUMERATOR_VALUE: async () => {
        const fields = await prisma.fractionProductField.findMany({
          where: {
            name,
          },
          select: {
            numeratorValue: true,
          },
          distinct: ['numeratorValue'],
        });

        return fields.map((field) => field.numeratorValue);
      },
      DENOMINATOR_VALUE: async () => {
        const fields = await prisma.fractionProductField.findMany({
          where: {
            name,
          },
          select: {
            denominatorValue: true,
          },
          distinct: ['denominatorValue'],
        });

        return fields.map((field) => field.denominatorValue);
      },
      METRIC_UNIT: async () => {
        const fields = await prisma.fractionProductField.findMany({
          where: {
            name,
          },
          select: {
            metricUnit: true,
          },
          distinct: ['metricUnit'],
        });

        return fields.map((field) => field.metricUnit);
      },
    };

    return await queries[valueType]();
  }

  async create(params: CreateProductDto) {
    const {
      name,
      manufacturer,
      booleanFields,
      stringFields,
      quantityFields,
      fractionFields,
      ...remainingParams
    } = params;

    if (
      await prisma.product.findUnique({
        where: {
          name,
        },
      })
    )
      throw new ConflictException('Name already exists');

    let manufacturerId: number;

    if (manufacturer) {
      if (typeof manufacturer === 'string') {
        const { id } = await this.manufacturersService.create({
          name: manufacturer,
        });

        manufacturerId = id;
      } else if (typeof manufacturer === 'number')
        manufacturerId = manufacturer;
      else
        throw new BadRequestException([
          'manufacturer must be number or string',
        ]);
    }

    const checkUnique = (fields: { name: string }[]) => {
      const nameSet = new Set<string>();

      for (const item of fields) {
        if (nameSet.has(item.name))
          throw new ConflictException(
            'Fields with the same name are not allowed. Please make sure that all field names are unique',
          );

        nameSet.add(item.name);
      }
    };

    const fields = [];

    if (booleanFields) fields.push(...booleanFields);
    if (stringFields) fields.push(...stringFields);
    if (quantityFields) fields.push(...quantityFields);
    if (fractionFields) fields.push(...fractionFields);

    checkUnique(fields);

    return await prisma.product.create({
      data: {
        name,
        manufacturer: manufacturer && {
          connect: {
            id: manufacturerId,
          },
        },
        ...remainingParams,
        booleanFields: booleanFields && {
          createMany: {
            data: booleanFields,
          },
        },
        stringFields: stringFields && {
          createMany: {
            data: stringFields,
          },
        },
        quantityFields: quantityFields && {
          createMany: {
            data: quantityFields,
          },
        },
        fractionFields: fractionFields && {
          createMany: {
            data: fractionFields,
          },
        },
      },
      include: {
        booleanFields: true,
        stringFields: true,
        quantityFields: true,
        fractionFields: true,
      },
    });
  }
}
