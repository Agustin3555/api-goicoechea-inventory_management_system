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
  GetBooleanCharSuggestionsDto,
  GetFractionCharSuggestionsDto,
  GetQuantityCharSuggestionsDto,
  GetStringCharSuggestionsDto,
} from './dtos';

const prisma = new PrismaService();

@Injectable()
export class ProductsService {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  async findAll() {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return products;
  }

  async getOneFullData(id: number) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        description: true,
        stock: true,
        minStock: true,
        unitPrice: true,
        createdAt: true,
        updatedAt: true,
        manufacturer: {
          select: {
            id: true,
            name: true,
          },
        },
        booleanFields: {
          select: {
            name: true,
            value: true,
          },
        },
        quantityFields: {
          select: {
            name: true,
            value: true,
            metricUnit: true,
          },
        },
        fractionFields: {
          select: {
            name: true,
            numeratorValue: true,
            denominatorValue: true,
            metricUnit: true,
          },
        },
        stringFields: {
          select: {
            name: true,
            value: true,
          },
        },
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

  async create(params: CreateProductDto) {
    const {
      name,
      manufacturer,
      booleanFields,
      stringFields,
      quantityFields,
      fractionFields,
      ...remainingParams // TODO: nop
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
        ...remainingParams,
      },
      include: {
        booleanFields: true,
        stringFields: true,
        quantityFields: true,
        fractionFields: true,
      },
    });
  }

  async getBooleanCharSuggestions(params: GetBooleanCharSuggestionsDto) {
    const { field } = params;

    const selectByField: {
      [key: string]: Prisma.BooleanProductFieldScalarFieldEnum;
    } = {
      KEY: 'name',
    };

    const selectedField = selectByField[field];

    const chars = await prisma.booleanProductField.findMany({
      select: {
        [selectedField]: true,
      },
    });

    const suggestions: (number | string)[] = chars.map(
      (item) => item[selectedField],
    );

    return suggestions;
  }

  async getQuantityCharSuggestions(params: GetQuantityCharSuggestionsDto) {
    const { name, field } = params;

    const selectByField: {
      [key: string]: Prisma.QuantityProductFieldScalarFieldEnum;
    } = {
      KEY: 'name',
      VALUE: 'value',
      METRIC_UNIT: 'metricUnit',
    };

    const selectedField = selectByField[field];

    let query = {
      select: {
        [selectedField]: true,
      },
      distinct: [selectedField],
    };

    if (name) query = { ...query, ...{ where: { name } } };

    const chars = await prisma.quantityProductField.findMany(query);

    const suggestions: (number | string)[] = chars.map(
      (item) => item[selectedField],
    );

    return suggestions;
  }

  async getFractionCharSuggestions(params: GetFractionCharSuggestionsDto) {
    const { name, field } = params;

    const selectByField: {
      [key: string]: Prisma.FractionProductFieldScalarFieldEnum;
    } = {
      KEY: 'name',
      NUMERATOR_VALUE: 'numeratorValue',
      DENOMINATOR_VALUE: 'denominatorValue',
      METRIC_UNIT: 'metricUnit',
    };

    const selectedField = selectByField[field];

    let query = {
      select: {
        [selectedField]: true,
      },
      distinct: [selectedField],
    };

    if (name) query = { ...query, ...{ where: { name } } };

    const chars = await prisma.fractionProductField.findMany(query);

    const suggestions: (number | string)[] = chars.map(
      (item) => item[selectedField],
    );

    return suggestions;
  }

  async getStringCharSuggestions(params: GetStringCharSuggestionsDto) {
    const { name, field } = params;

    const selectByField: {
      [key: string]: Prisma.StringProductFieldScalarFieldEnum;
    } = {
      KEY: 'name',
      VALUE: 'value',
    };

    const selectedField = selectByField[field];

    let query = {
      select: {
        [selectedField]: true,
      },
      distinct: [selectedField],
    };

    if (name) query = { ...query, ...{ where: { name } } };

    const chars = await prisma.stringProductField.findMany(query);

    const suggestions: (number | string)[] = chars.map(
      (item) => item[selectedField],
    );

    return suggestions;
  }
}
