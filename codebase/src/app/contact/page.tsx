'use client';

import { AuthorContactView } from '@/components/contact/author-contact-view';
import { ContactSurveyForm } from '@/components/contact/contact-survey-form';

export default function ContactPage() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <ContactSurveyForm />
      <div className="border-t border-slate-800/80 pt-8">
        <AuthorContactView />
      </div>
    </div>
  );
}
