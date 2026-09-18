import type { z } from 'zod';
import type { AccountRole, PlatformRpc } from './models';
import * as s from './schemas';

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  roles: readonly AccountRole[];
  feature: string;
  summary: string;
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  rpc?: PlatformRpc;
  action?: string;
  status?: number;
  response: string;
}
const all = ['student','lecture','admin'] as const;
const student = ['student'] as const;
const staff = ['lecture','admin'] as const;
const admin = ['admin'] as const;
export const endpoints = {
  register: { method:'POST',path:'/auth/register',roles:[],feature:'Auth',summary:'Đăng ký Student; xác nhận email theo cấu hình Supabase',body:s.registerInput,status:201,response:'Session' },
  login: { method:'POST',path:'/auth/login',roles:[],feature:'Auth',summary:'Đăng nhập và lấy token cùng profile',body:s.loginInput,response:'Session' },
  refresh: { method:'POST',path:'/auth/refresh',roles:[],feature:'Auth',summary:'Đổi refresh token lấy phiên mới',body:s.refreshInput,response:'Session' },
  logout: { method:'POST',path:'/auth/logout',roles:all,feature:'Auth',summary:'Thu hồi refresh token của phiên hiện tại và chặn access token',response:'LoggedOut' },
  me: { method:'GET',path:'/me',roles:all,feature:'Profile',summary:'Lấy profile và quyền hiện tại',rpc:'platform_profile',action:'get',response:'Profile' },
  updateMe: { method:'PATCH',path:'/me',roles:all,feature:'Profile',summary:'Sửa thông tin cá nhân và mục tiêu học',body:s.profileInput,rpc:'platform_profile',action:'update',response:'Profile' },
  catalog: { method:'GET',path:'/catalog/labs',roles:[],feature:'Guest',summary:'Danh sách lab, nội dung học và link đã kiểm chứng',response:'Catalog' },
  nodes: { method:'GET',path:'/learning/nodes',roles:student,feature:'Learning',summary:'Danh sách node từ catalog dùng tạo roadmap',response:'Nodes' },
  analyze: { method:'POST',path:'/mentor/analyze',roles:student,feature:'Mentor',summary:'Phân tích nền tảng, mục tiêu và văn bản CV; trả nhãn AI hoặc baseline',body:s.analysisInput,response:'Analysis' },
  createRoadmap: { method:'POST',path:'/mentor/roadmap',roles:student,feature:'Mentor',summary:'Tạo và lưu roadmap tối đa 3 task; trả clarify/refuse nếu chưa thể tạo',body:s.roadmapInput,response:'RoadmapResult' },
  roadmaps: { method:'GET',path:'/mentor/roadmaps',roles:student,feature:'Mentor',summary:'Lịch sử roadmap của chính Student',query:s.pagination,rpc:'platform_learning',action:'list',response:'RoadmapList' },
  roadmap: { method:'GET',path:'/mentor/roadmaps/{id}',roles:student,feature:'Mentor',summary:'Đọc roadmap đã lưu',rpc:'platform_learning',action:'get',response:'Roadmap' },
  deleteRoadmap: { method:'DELETE',path:'/mentor/roadmaps/{id}',roles:student,feature:'Mentor',summary:'Xóa roadmap cá nhân',rpc:'platform_learning',action:'delete',response:'Deleted' },
  task: { method:'PATCH',path:'/mentor/roadmaps/{id}/tasks/{itemId}',roles:student,feature:'Progress',summary:'Cập nhật task thuộc roadmap của mình',body:s.taskInput,rpc:'platform_learning',action:'task',response:'Roadmap' },
  progress: { method:'GET',path:'/learning/progress',roles:student,feature:'Progress',summary:'Tiến độ theo từng roadmap cá nhân',query:s.pagination,rpc:'platform_learning',action:'progress',response:'ProgressList' },
  updateProgress: { method:'POST',path:'/learning/progress',roles:student,feature:'Progress',summary:'Cập nhật node có thật trong roadmap (alias của PATCH task)',body:s.progressInput,rpc:'platform_learning',action:'task',response:'Roadmap' },
  studentDocuments: { method:'GET',path:'/learning/documents',roles:student,feature:'Learning',summary:'Danh sách tài liệu đã xuất bản',query:s.pagination,rpc:'platform_documents',action:'list',response:'DocumentList' },
  studentDocument: { method:'GET',path:'/learning/documents/{id}',roles:student,feature:'Learning',summary:'Đọc thông tin học liệu đã xuất bản; không lộ đường dẫn nội bộ',rpc:'platform_documents',action:'get',response:'PublicDocument' },
  documents: { method:'GET',path:'/lecture/documents',roles:staff,feature:'Lecture documents',summary:'Lecture xem tài liệu của mình; Admin xem toàn bộ',query:s.pagination.extend({status:s.documentStatus.optional()}).strict(),rpc:'platform_documents',action:'list',response:'DocumentList' },
  createDocument: { method:'POST',path:'/lecture/documents',roles:staff,feature:'Lecture documents',summary:'Tạo bản nháp metadata học liệu PDF/TXT/MD; chưa upload file',body:s.documentInput,rpc:'platform_documents',action:'create',status:201,response:'Document' },
  document: { method:'GET',path:'/lecture/documents/{id}',roles:staff,feature:'Lecture documents',summary:'Đọc chi tiết tài liệu trong phạm vi sở hữu',rpc:'platform_documents',action:'get',response:'Document' },
  updateDocument: { method:'PUT',path:'/lecture/documents/{id}',roles:staff,feature:'Lecture documents',summary:'Sửa metadata và tạo phiên bản mới; phải archive bản published trước',body:s.documentUpdate,rpc:'platform_documents',action:'update',response:'Document' },
  deleteDocument: { method:'DELETE',path:'/lecture/documents/{id}',roles:staff,feature:'Lecture documents',summary:'Xóa mềm tài liệu; giữ lịch sử và audit',body:s.revisionInput,rpc:'platform_documents',action:'delete',response:'Document' },
  submitDocument: { method:'POST',path:'/lecture/documents/{id}/submit',roles:staff,feature:'Document review',summary:'Đưa bản nháp vào hàng chờ review',body:s.revisionInput,rpc:'platform_documents',action:'submit',response:'Document' },
  reviewDocument: { method:'POST',path:'/lecture/documents/{id}/review',roles:staff,feature:'Document review',summary:'Lecture khác hoặc Admin ghi quyết định duyệt cho đúng revision',body:s.reviewInput,rpc:'platform_documents',action:'review',response:'Document' },
  publishDocument: { method:'POST',path:'/lecture/documents/{id}/publish',roles:staff,feature:'Document review',summary:'Lecture khác hoặc Admin xuất bản đúng revision đã được duyệt',body:s.revisionInput,rpc:'platform_documents',action:'publish',response:'Document' },
  archiveDocument: { method:'POST',path:'/lecture/documents/{id}/archive',roles:staff,feature:'Document review',summary:'Thu hồi tài liệu khỏi danh sách Student',body:s.revisionInput,rpc:'platform_documents',action:'archive',response:'Document' },
  versions: { method:'GET',path:'/lecture/documents/{id}/versions',roles:staff,feature:'Document review',summary:'Lịch sử metadata theo revision',rpc:'platform_documents',action:'versions',response:'VersionList' },
  reviews: { method:'GET',path:'/lecture/documents/{id}/reviews',roles:staff,feature:'Document review',summary:'Lịch sử quyết định duyệt',rpc:'platform_documents',action:'reviews',response:'ReviewList' },
  users: { method:'GET',path:'/admin/users',roles:admin,feature:'Admin users',summary:'Danh sách profile có phân trang và lọc role',query:s.pagination.extend({role:s.accountRole.optional()}).strict(),rpc:'platform_admin',action:'users',response:'ProfileList' },
  user: { method:'GET',path:'/admin/users/{id}',roles:admin,feature:'Admin users',summary:'Chi tiết profile người dùng',rpc:'platform_admin',action:'get',response:'Profile' },
  userRole: { method:'PATCH',path:'/admin/users/{id}/role',roles:admin,feature:'Admin users',summary:'Đổi role/tier; cấm tự đổi role',body:s.roleInput,rpc:'platform_admin',action:'role',response:'Profile' },
  userStatus: { method:'PATCH',path:'/admin/users/{id}/status',roles:admin,feature:'Admin users',summary:'Khóa/mở tài khoản; có hiệu lực trên request tiếp theo',body:s.statusInput,rpc:'platform_admin',action:'status',response:'Profile' },
  adminDocuments: { method:'GET',path:'/admin/documents',roles:admin,feature:'Admin content',summary:'Toàn bộ tài liệu để quản trị',query:s.pagination,rpc:'platform_documents',action:'list',response:'DocumentList' },
  adminDocument: { method:'GET',path:'/admin/documents/{id}',roles:admin,feature:'Admin content',summary:'Chi tiết tài liệu của bất kỳ Lecture nào',rpc:'platform_documents',action:'get',response:'Document' },
  adminReview: { method:'POST',path:'/admin/documents/{id}/review',roles:admin,feature:'Admin content',summary:'Duyệt tài liệu đang review',body:s.reviewInput,rpc:'platform_documents',action:'review',response:'Document' },
  adminPublish: { method:'POST',path:'/admin/documents/{id}/publish',roles:admin,feature:'Admin content',summary:'Xuất bản tài liệu đã được duyệt',body:s.revisionInput,rpc:'platform_documents',action:'publish',response:'Document' },
  adminArchive: { method:'POST',path:'/admin/documents/{id}/archive',roles:admin,feature:'Admin content',summary:'Thu hồi tài liệu khỏi Student',body:s.revisionInput,rpc:'platform_documents',action:'archive',response:'Document' },
  adminDelete: { method:'DELETE',path:'/admin/documents/{id}',roles:admin,feature:'Admin content',summary:'Xóa mềm tài liệu chưa published',body:s.revisionInput,rpc:'platform_documents',action:'delete',response:'Document' },
  audit: { method:'GET',path:'/admin/audit',roles:admin,feature:'Admin audit',summary:'Nhật ký thao tác role và tài liệu',query:s.pagination,rpc:'platform_admin',action:'audit',response:'AuditList' },
  analytics: { method:'GET',path:'/admin/analytics',roles:admin,feature:'Admin analytics',summary:'Số user, tài liệu published, review và roadmap',rpc:'platform_admin',action:'analytics',response:'Analytics' },
} satisfies Record<string, EndpointSpec>;
export type OperationId = keyof typeof endpoints;
