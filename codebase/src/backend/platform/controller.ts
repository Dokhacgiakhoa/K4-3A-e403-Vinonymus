import { z } from 'zod';
import { PLANNER_CATALOG, findLab } from '@/data/planner-catalog';
import type { Json } from '@/types/database';
import { authorize, bearerToken } from './auth';
import { createPlatformDependencies, type AuthInput, type PlatformDependencies } from './dependencies';
import { endpoints, type EndpointSpec, type OperationId } from './endpoints';
import { ApiError, errorResponse, jsonBody } from './http';
import { analyzeLearner, generateRoadmap } from './mentor';
import { analysisInput, roadmapInput, documentInput } from './schemas';
import { authenticate, type AuthOperation } from '@/backend/modules/auth/auth.service';
import { executeLearningOperation, type LearningOperation } from '@/backend/modules/learning/learning.service';
import { executeLectureOperation, type LectureOperation } from '@/backend/modules/lecture/lecture.service';
import { executeAdminOperation, type AdminOperation } from '@/backend/modules/admin/admin.service';

export type RouteContext = { params: Promise<Record<string,string>> };
type Params = Record<string,string>;

function validateReferences(operation: OperationId, body: Record<string, unknown>) {
  if (['createDocument','updateDocument'].includes(operation)) {
    const doc = documentInput.parse(Object.fromEntries(Object.entries(body).filter(([key]) => key !== 'revision')));
    const lab = findLab(doc.labId);
    if (!lab || doc.itemIds.some(id => !lab.items.some(item => item.itemId === id)) || new Set(doc.itemIds).size !== doc.itemIds.length)
      throw new ApiError(400, 'INVALID_CATALOG_REFERENCE', 'Lab hoặc item không thuộc catalog.');
    const mime = {pdf:'application/pdf',text:'text/plain',markdown:'text/markdown'}[doc.fileType];
    if (doc.mimeType !== mime) throw new ApiError(400, 'INVALID_FILE_TYPE', 'MIME type không khớp loại tài liệu.');
  }
}

export async function execute(operation: OperationId, request: Request, params: Params = {}, injected?: PlatformDependencies): Promise<Response> {
  try {
    const spec: EndpointSpec = endpoints[operation];
    if (request.method !== spec.method) throw new ApiError(405, 'METHOD_NOT_ALLOWED', 'Method không hợp lệ.');
    // Check the bearer header before resolving infrastructure configuration.
    if (spec.roles.length) bearerToken(request);
    const deps = injected ?? (operation === 'catalog' ? undefined : createPlatformDependencies());
    const profile = spec.roles.length ? await authorize(request, spec.roles, deps!) : undefined;
    if (spec.path.includes('{id}')) z.string().uuid().parse(params.id);
    if (spec.path.includes('{itemId}')) z.string().min(1).max(150).parse(params.itemId);
    const body = spec.body ? spec.body.parse(await jsonBody(request)) as Record<string,unknown> : {};
    const query = spec.query ? spec.query.parse(Object.fromEntries(new URL(request.url).searchParams)) as Record<string,unknown> : {};
    validateReferences(operation, body);
    let data: unknown;
    if (operation === 'catalog') data = PLANNER_CATALOG;
    else if (operation === 'nodes') data = PLANNER_CATALOG.flatMap(lab => lab.items.map(item => ({ ...item, labId: lab.labId })));
    else if (operation === 'register' || operation === 'login' || operation === 'refresh' || operation === 'logout')
      data = await authenticate(deps!, operation as AuthOperation, body as AuthInput, operation === 'logout' ? bearerToken(request) : undefined);
    else if (operation === 'analyze') data = await analyzeLearner(analysisInput.parse(body), request);
    else if (operation === 'createRoadmap') {
      const input = roadmapInput.parse(body);
      const result = await generateRoadmap({ background: input.background, availableMinutes: input.available_minutes, labId: input.lab_id, note: input.note }, request);
      if (result.status !== 'plan') data = result;
      else {
        const roadmap = await deps!.rpc('platform_learning', { p_actor: profile!.id, p_action: 'create', p_target: null,
          p_data: { labId: input.lab_id, source: result.source, diagnosis: { ...result.diagnosis },
            tasks: result.tasks.map(task => ({ ...task, status: 'todo', completedAt: null })) } });
        data = { status: 'plan', message: result.message, roadmap };
      }
    } else if (spec.rpc === 'platform_learning' && spec.action) {
      const target = operation === 'updateProgress' ? String(body.roadmapId) : params.id ?? null;
      const input = { ...query, ...body, ...(params.itemId ? {itemId:params.itemId} : {}), ...(operation === 'updateProgress' ? {itemId:body.nodeId} : {}) };
      data = await executeLearningOperation(deps!, spec.action as LearningOperation, profile!.id, target, input as Json);
    } else if (spec.rpc === 'platform_documents' && spec.action) {
      const target = params.id ?? null;
      const input = { ...query, ...body };
      data = await executeLectureOperation(deps!, spec.action as LectureOperation, profile!.id, target, input as Json);
    } else if (spec.rpc === 'platform_admin' && spec.action) {
      const target = params.id ?? null;
      const input = { ...query, ...body };
      data = await executeAdminOperation(deps!, spec.action as AdminOperation, profile!.id, target, input as Json);
    } else if (spec.rpc && spec.action) {
      const target = operation === 'updateProgress' ? String(body.roadmapId) : params.id ?? null;
      const input = { ...query, ...body, ...(params.itemId ? {itemId:params.itemId} : {}), ...(operation === 'updateProgress' ? {itemId:body.nodeId} : {}) };
      data = await deps!.rpc(spec.rpc, { p_actor: profile!.id, p_action: spec.action, p_target: target, p_data: input as Json });
    } else throw new ApiError(500, 'UNIMPLEMENTED', 'Endpoint chưa được triển khai.');
    return Response.json({ data, ...(spec.query ? {meta:{limit:query.limit,offset:query.offset,count:Array.isArray(data) ? data.length : 0}} : {}) },
      { status: spec.status ?? 200, headers: {'Cache-Control':'no-store'} });
  } catch (error) { return errorResponse(error); }
}

export function handler(operation: OperationId) {
  return async (request: Request, context: RouteContext) => execute(operation, request, await context.params);
}
