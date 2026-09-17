import { z } from 'zod';
import { background } from '../requests/platform-common';
import { roadmap, task, id, time } from './platform-base.response';

export const Analysis = z.object({source:z.enum(['ai','baseline']),background,goal:z.string(),availableMinutes:z.number(),summary:z.string(),evidence:z.array(z.string()),
  recommendedLabId:z.string(),requiresAssessment:z.literal(true),cvTextProvided:z.boolean(),
  nextStep:z.object({endpoint:z.literal('/api/v1/mentor/roadmap'),body:z.object({background,available_minutes:z.number(),lab_id:z.string(),note:z.string()})})});
export const RoadmapResult = z.union([z.object({status:z.literal('plan'),message:z.string(),roadmap}),
  z.object({status:z.literal('clarify'),question:z.string()}),z.object({status:z.literal('refuse'),message:z.string()})]);
export const Roadmap = roadmap;
export const RoadmapList = z.array(roadmap);
export const Deleted = z.object({id,deleted:z.literal(true)});
export const ProgressList = z.array(z.object({roadmap_id:id,lab_id:z.string(),tasks:z.array(task),updated_at:time}));