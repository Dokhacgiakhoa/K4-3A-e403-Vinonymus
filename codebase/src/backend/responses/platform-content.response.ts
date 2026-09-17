import { z } from 'zod';
import { id, time, doc, publicDoc, docSummary } from './platform-base.response';

export const Document = doc;
export const PublicDocument = publicDoc;
export const DocumentList = z.array(docSummary);
export const VersionList = z.array(z.object({id,document_id:id,revision:z.number(),snapshot:doc,created_at:time}));
export const ReviewList = z.array(z.object({id,document_id:id,reviewer_id:id,decision:z.enum(['approved','rejected','needs_changes']),note:z.string().nullable(),revision:z.number().nullable(),created_at:time}));