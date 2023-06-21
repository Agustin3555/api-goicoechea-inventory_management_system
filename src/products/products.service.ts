import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateProductDto,
  EditProductDto,
  GetBooleanCharSuggestionsDto,
  GetFractionCharSuggestionsDto,
  GetQuantityCharSuggestionsDto,
  GetStringCharSuggestionsDto,
} from './dtos';

const prisma = new PrismaService();

@Injectable()
export class ProductsService {
  async findAll() {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return products;
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

  async getOneFullDataPrivate(id: number) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        description: true,
        stock: true,
        minStock: true,
        price: true,
        imported: true,
        discontinued: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            email: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            email: true,
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

    // TODO: no dara el errorCode porque corre riesgo debelar el Id. Aplicar esto a todos los casos similares
    if (!product) throw new NotFoundException();

    return product;
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
      distinct: [selectedField],
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

  async create(params: CreateProductDto, userId: number) {
    const {
      name,
      manufacturer,
      category,
      description,
      stock,
      minStock,
      price,
      imported,
      discontinued,
      booleanFields,
      quantityFields,
      fractionFields,
      stringFields,
    } = params;

    if (
      await prisma.product.findUnique({
        where: {
          name,
        },
      })
    )
      throw new ConflictException({ errorCode: 'ERR_NAME_UNIQUE' });

    const checkUnique = (fields: { name: string }[]) => {
      const nameSet = new Set<string>();

      for (const item of fields) {
        if (nameSet.has(item.name))
          throw new ConflictException({
            errorCode: 'ERR_PRODUCT_CHARS_KEY_UNIQUE',
          });

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
        description,
        stock,
        minStock,
        price,
        imported,
        discontinued,
        manufacturer: manufacturer && {
          connect: {
            id: manufacturer,
          },
        },
        category: category && {
          connect: {
            id: category,
          },
        },
        createdByUser: {
          connect: {
            id: userId,
          },
        },
        booleanFields: booleanFields && {
          createMany: {
            data: booleanFields,
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
        stringFields: stringFields && {
          createMany: {
            data: stringFields,
          },
        },
      },
      include: {
        booleanFields: true,
        quantityFields: true,
        fractionFields: true,
        stringFields: true,
      },
    });
  }

  async edit(id: number, params: EditProductDto, userId: number) {
    const {
      name,
      manufacturer,
      category,
      description,
      stock,
      minStock,
      price,
      imported,
      discontinued,
    } = params;

    if (
      !(await prisma.product.findUnique({
        where: {
          id,
        },
      }))
    )
      throw new NotFoundException();

    if (
      name !== undefined &&
      (
        await prisma.product.findUnique({
          where: {
            name,
          },
        })
      )?.id === id
    )
      throw new ConflictException({ errorCode: 'ERR_NAME_UNIQUE' });

    return await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        stock,
        minStock,
        price,
        imported,
        discontinued,
        updatedAt: new Date(),
        manufacturer: manufacturer && {
          connect: {
            id: manufacturer,
          },
        },
        category: category && {
          connect: {
            id: category,
          },
        },
        updatedByUser: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        name: name !== undefined && true,
        description: description !== undefined && true,
        stock: stock !== undefined && true,
        minStock: minStock !== undefined && true,
        price: price !== undefined && true,
        imported: imported !== undefined && true,
        discontinued: discontinued !== undefined && true,
        updatedAt: true,
        manufacturer: manufacturer !== undefined && {
          select: {
            id: true,
            name: true,
          },
        },
        category: category !== undefined && {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
