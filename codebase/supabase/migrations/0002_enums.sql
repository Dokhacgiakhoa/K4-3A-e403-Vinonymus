create type doc_status       as enum ('draft', 'published', 'archived');
create type answer_path      as enum ('faq', 'cache', 'rag', 'refused', 'error');
create type unanswered_state as enum ('pending', 'resolved', 'ignored');
