import { z } from 'zod';
import { accountRole } from './platform-common';

export const roleInput = z.object({ role: accountRole, tier: z.enum(['free','vip']).optional() }).strict();
export const statusInput = z.object({ isActive: z.boolean() }).strict();