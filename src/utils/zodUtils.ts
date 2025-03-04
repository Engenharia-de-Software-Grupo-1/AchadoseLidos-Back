import { z } from "zod";

export const optionalString = () => z.string().optional();
export const optionalStringWithLength = (length: number) => {
  return z.string().length(length, { message: `Campo deve ter ${length} caracteres` }).optional();
};

export const requiredString = () => z.string({ required_error: 'Campo obrigatório' });
export const requiredStringWithLength = (length: number) => {
  return requiredString().length(length, { message: `Campo deve ter ${length} caracteres` });
};
export const requiredStringWithRange = (min: number, max: number) => {
  return requiredString()
    .min(min, { message: `Campo deve ter ${min} caracteres` })
    .max(max, { message: `Campo deve ter ${max} caracteres` });
};

export const requiredBoolean = () => z.boolean({ required_error: 'Campo obrigatório' });
