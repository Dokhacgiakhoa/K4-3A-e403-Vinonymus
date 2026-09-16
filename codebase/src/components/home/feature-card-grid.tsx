'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Award, BookOpen, FileCheck2, User } from 'lucide-react';
import gsap from 'gsap';

export function FeatureCardGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      }
    );
  }, []);

  const featureCards = [
    {
      href: '/about',
      icon: Award,
      title: 'Ma Trận SFIA',
      desc: 'Khung Năng Lực Quốc Tế',
    },
    {
      href: '/learning',
      icon: BookOpen,
      title: 'Thư Viện Tự Học',
      desc: 'Từ L0 Đến L4',
    },
    {
      href: '/test',
      icon: FileCheck2,
      title: 'Luyện Thi Mô Phỏng',
      desc: 'Đề Test Đánh Giá SFIA',
    },
    {
      href: '/contact',
      icon: User,
      title: 'Tác Giả & Hỗ Trợ',
      desc: 'K.AI Labs Community',
    },
  ];

  return (
    <div ref={gridRef} className="relative z-10 mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {featureCards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="interactive-feature-card group"
          >
            <div className="card-icon-wrapper">
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="space-y-1 my-2">
              <h4 className="card-title">{card.title}</h4>
              <p className="card-desc">{card.desc}</p>
            </div>
            <div className="card-indicator">
              <span>● ● ●</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
