import { z } from 'zod';

export const requiredString = z.string().nonempty();
export const optionalString = z.string().nullable().optional();
