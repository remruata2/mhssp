'use client';

import HeroBanner from '@/components/HeroBanner';
import MiniServiceGrid from '@/components/ui/MiniServiceGrid';
import Projects from '@/components/Projects';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <Projects />
    </div>
  );
}