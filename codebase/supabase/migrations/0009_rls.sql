alter table public.categories           enable row level security;
alter table public.tags                 enable row level security;
alter table public.documents            enable row level security;
alter table public.document_tags        enable row level security;
alter table public.chunks               enable row level security;
alter table public.faqs                 enable row level security;
alter table public.faq_variants         enable row level security;
alter table public.query_logs           enable row level security;
alter table public.query_feedback       enable row level security;
alter table public.unanswered_questions enable row level security;
alter table public.semantic_cache       enable row level security;
alter table public.app_settings         enable row level security;

-- Đọc công khai cho nội dung đã xuất bản
create policy "categories_read" on public.categories for select using (true);
create policy "tags_read"       on public.tags       for select using (true);
create policy "documents_read"  on public.documents  for select using (status = 'published');
create policy "document_tags_read" on public.document_tags for select using (true);
create policy "chunks_read" on public.chunks for select using (
  exists (select 1 from public.documents d where d.id = chunks.document_id and d.status = 'published')
);
create policy "faqs_read"         on public.faqs         for select using (is_active);
create policy "faq_variants_read" on public.faq_variants for select using (true);
create policy "app_settings_read" on public.app_settings for select using (true);

-- App (dùng anon key) được PHÉP GHI vào đúng 4 bảng nhật ký/vận hành
create policy "query_logs_insert" on public.query_logs for insert with check (true);
create policy "query_feedback_insert" on public.query_feedback for insert with check (true);
create policy "unanswered_upsert" on public.unanswered_questions for all using (true) with check (true);
create policy "semantic_cache_all" on public.semantic_cache for all using (true) with check (true);
