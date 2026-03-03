import { z } from 'zod';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,128}$/;

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().regex(passwordRules, 'Password must be 12+ chars with uppercase, lowercase, number, and special character.'),
  confirmPassword: z.string().min(1)
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(12).max(128)
});
