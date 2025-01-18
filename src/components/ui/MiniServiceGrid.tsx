'use client';

import { FaHospital, FaUserMd, FaHandHoldingMedical } from 'react-icons/fa';
import ServiceBlock from './ServiceBlock';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const featuredServices = [
  {
    icon: <FaHospital />,
    title: "Health Infrastructure",
    description: "Strengthening healthcare facilities and infrastructure across Mizoram to ensure better access to quality healthcare services.",
    link: "/services/infrastructure"
  },
  {
    icon: <FaUserMd />,
    title: "Healthcare Professionals",
    description: "Training and capacity building of healthcare workers to deliver high-quality medical services to the community.",
    link: "/services/professionals"
  },
  {
    icon: <FaHandHoldingMedical />,
    title: "Community Health",
    description: "Engaging with communities to promote better health practices and ensure healthcare reaches every citizen.",
    link: "/services/community"
  }
];

export default function MiniServiceGrid() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
            <div className="mt-2 w-20 h-1 bg-red-600"></div>
          </div>
          <Link 
            href="/services" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Services <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <ServiceBlock
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
