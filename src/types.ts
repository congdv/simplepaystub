import z from 'zod';
import { PayStubSchema } from './schemas';

export type PayStubType = z.infer<typeof PayStubSchema>;

export type Country = {
  name: string;
  slug: string;
};
