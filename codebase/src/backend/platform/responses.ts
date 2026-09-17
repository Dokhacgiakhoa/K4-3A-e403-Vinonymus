import { z } from 'zod';
import { accountRole, background, documentStatus, taskInput } from './schemas';

const id = z.string().uuid();
const time = z.string();
const profile = z.object({
  id, display_name:z.string(),role:accountRole,tier:z.enum(['free','vip']),is_active:z.boolean(),
  background:background.nullable(),goal:z.string(),weekly_minutes:z.number().int(),created_at:time,updated_at:time,
});
const task = z.object({ itemId:z.string(),title:z.string(),url:z.string().url(),type:z.enum(['slide','video','notebook','doc']),
  minutes:z.number(),reason:z.string(),status:taskInput.shape.status,completedAt:time.nullable() });
const diagnosis = z.object({background,confidence:z.enum(['high','low']),summary:z.string()});
const roadmap = z.object({id,student_id:id,lab_id:z.string(),source:z.enum(['ai','baseline']),diagnosis,tasks:z.array(task).min(1).max(3),created_at:time,updated_at:time});
const publicDoc = z.object({id,title:z.string(),summary:z.string(),lab_id:z.string().nullable(),item_ids:z.array(z.string()),
  file_type:z.enum(['pdf','text','markdown']),status:documentStatus,revision:z.number().int(),published_at:time.nullable()});
const doc = publicDoc.extend({owner_id:id,source_path:z.string(),file_name:z.string(),mime_type:z.string(),file_size_bytes:z.number(),
  qdrant_collection:z.string(),content_hash:z.string(),chunk_count:z.number().int(),review_note:z.string().nullable(),
  published_by:id.nullable(),created_at:time,updated_at:time,approved_revision:z.number().int().nullable(),deleted_at:time.nullable()});
const docSummary = publicDoc.extend({owner_id:id,updated_at:time});
const question = z.object({id:z.string(),text:z.string(),options:z.object({A:z.string(),B:z.string(),C:z.string(),D:z.string()})});
const quiz = z.object({id,owner_id:id,title:z.string(),lab_id:z.string(),questions:z.array(question.extend({correctOption:z.enum(['A','B','C','D']),explanation:z.string()})),
  pass_percent:z.number(),status:z.enum(['draft','published','archived']),revision:z.number(),deleted_at:time.nullable(),created_at:time,updated_at:time});
const quizSummary = quiz.pick({id:true,owner_id:true,title:true,lab_id:true,pass_percent:true,status:true,revision:true}).extend({question_count:z.number()});
const attempt = z.object({id,student_id:id,quiz_id:id,quiz_revision:z.number(),request_id:id,created_at:time,
  answers:z.array(z.object({questionId:z.string(),option:z.enum(['A','B','C','D'])})),
  result:z.object({correctAnswers:z.number(),totalQuestions:z.number(),scorePercent:z.number(),passed:z.boolean(),
    details:z.array(z.object({questionId:z.string(),correct:z.boolean(),correctOption:z.enum(['A','B','C','D']),explanation:z.string()}))})});
const item = z.object({itemId:z.string(),title:z.string(),url:z.string().url(),type:z.enum(['slide','video','notebook','doc']),
  minutes:z.number(),level:z.enum(['basic','advanced']),tags:z.array(z.string()),why:z.string()});
export const responses: Record<string,z.ZodTypeAny> = {
  Profile:profile,ProfileList:z.array(profile),
  Session:z.union([z.object({requiresEmailConfirmation:z.literal(true),session:z.null()}),
    z.object({accessToken:z.string(),refreshToken:z.string(),expiresAt:z.number().nullable(),requiresEmailConfirmation:z.literal(false),user:profile})]),
  LoggedOut:z.object({loggedOut:z.literal(true)}),
  Catalog:z.array(z.object({labId:z.string(),title:z.string(),description:z.string(),items:z.array(item)})),
  Nodes:z.array(item.extend({labId:z.string()})),
  Analysis:z.object({source:z.enum(['ai','baseline']),background,goal:z.string(),availableMinutes:z.number(),summary:z.string(),evidence:z.array(z.string()),
    recommendedLabId:z.string(),requiresAssessment:z.literal(true),cvTextProvided:z.boolean(),
    nextStep:z.object({endpoint:z.literal('/api/v1/mentor/roadmap'),body:z.object({background,available_minutes:z.number(),lab_id:z.string(),note:z.string()})})}),
  RoadmapResult:z.union([z.object({status:z.literal('plan'),message:z.string(),roadmap}),
    z.object({status:z.literal('clarify'),question:z.string()}),z.object({status:z.literal('refuse'),message:z.string()})]),
  Roadmap:roadmap,RoadmapList:z.array(roadmap),Deleted:z.object({id,deleted:z.literal(true)}),
  ProgressList:z.array(z.object({roadmap_id:id,lab_id:z.string(),tasks:z.array(task),updated_at:time})),
  Document:doc,PublicDocument:publicDoc,DocumentList:z.array(docSummary),
  VersionList:z.array(z.object({id,document_id:id,revision:z.number(),snapshot:doc,created_at:time})),
  ReviewList:z.array(z.object({id,document_id:id,reviewer_id:id,decision:z.enum(['approved','rejected','needs_changes']),note:z.string().nullable(),revision:z.number().nullable(),created_at:time})),
  Quiz:quiz,StudentQuiz:quiz.extend({questions:z.array(question)}),QuizList:z.array(quizSummary),
  Attempt:attempt,AttemptList:z.array(attempt),
  AuditList:z.array(z.object({id,actor_id:id.nullable(),action:z.string(),resource_id:id.nullable(),details:z.record(z.unknown()),created_at:time})),
  Analytics:z.object({users:z.number(),activeUsers:z.number(),publishedDocuments:z.number(),pendingReviews:z.number(),roadmaps:z.number(),quizAttempts:z.number()}),
};
export const errorSchema = z.object({error:z.object({code:z.string(),message:z.string(),details:z.unknown().optional()})});
