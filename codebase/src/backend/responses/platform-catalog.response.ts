import { z } from 'zod';
import { item } from './platform-base.response';

export const Catalog = z.array(z.object({labId:z.string(),title:z.string(),description:z.string(),items:z.array(item)}));
export const Nodes = z.array(item.extend({labId:z.string()}));