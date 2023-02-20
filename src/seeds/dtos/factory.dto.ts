/* eslint-disable prettier/prettier */
import { INestApplicationContext } from '@nestjs/common';

export type Factory = (
  app: INestApplicationContext,
  count: number,
) => Promise<void>;
