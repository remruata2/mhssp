'use client';

import PageTitle from '@/components/ui/PageTitle';
import ServiceGrid from '@/components/ui/ServiceGrid';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Our Services" 
        subtitle="Comprehensive healthcare services for the people of Meghalaya"
      />
      <ServiceGrid />
    </div>
  );
}
