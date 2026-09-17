'use client';

import { AuthorContactView } from '@/components/contact/author-contact-view';
import { ContactSurveyForm } from '@/components/contact/contact-survey-form';

export default function ContactPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <AuthorContactView />
      <ContactSurveyForm />
    </div>
  );
}
