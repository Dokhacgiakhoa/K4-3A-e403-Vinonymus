'use client';

import React from 'react';
import { HomeLandingView } from '@/components/home/home-landing-view';
import { useRouter } from 'next/navigation';

export function GuestHomeView() {
  const router = useRouter();

  const handleNavigateTab = (tab: 'home' | 'about' | 'learning' | 'test' | 'architecture' | 'contact') => {
    if (tab === 'home') router.push('/');
    else router.push(`/${tab}`);
  };

  return <HomeLandingView />;
}
