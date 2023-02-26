import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import {
  CreateAssortedProductOfferDto,
  CreateProductOfferDto,
} from './dtos/controllers';

const prisma = new PrismaService();

@Injectable()
export class OffersService {
  constructor(private readonly productsService: ProductsService) {}

  async createProductOffer(params: CreateProductOfferDto) {
    const { product: productId, quantity, newPrice, deadline } = params;

    const product = await this.productsService.findOne(productId);

    const { productOffers } = product;

    const newQuantity = quantity === undefined ? 1 : quantity;

    if (productOffers.length !== 0) {
      for (let i = 0; i < productOffers.length; i++) {
        const item = productOffers[i];

        if (item.quantity === newQuantity && !item.closed)
          throw new ConflictException(
            'There is already an open offer with the same quantity',
          );
      }
    }

    return await prisma.productOffer.create({
      data: {
        productId,
        quantity: newQuantity,
        newPrice,
        deadline: new Date(deadline),
      },
    });
  }

  async createAssortedProductOffer(params: CreateAssortedProductOfferDto) {
    const { products, deadline, newPrice } = params;

    // TODO: validar: si ya existe una oferta igual que este activa

    products.forEach(
      async (item) => await this.productsService.findOne(item.product),
    );

    return await prisma.assortedProductOffer.create({
      data: {
        newPrice,
        deadline: new Date(deadline),
        products: {
          create: products.map((item) => {
            const { product, quantity } = item;

            return {
              productId: product,
              quantity,
            };
          }),
        },
      },
      include: {
        products: true,
      },
    });
  }
}
