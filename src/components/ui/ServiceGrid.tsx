'use client';

import { FaHospital, FaUserMd, FaHandHoldingMedical, FaBookMedical, FaClinicMedical, FaAmbulance } from 'react-icons/fa';
import ServiceBlock from './ServiceBlock';

const services = [
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
  },
  {
    icon: <FaBookMedical />,
    title: "Health Education",
    description: "Promoting health education and awareness to empower communities with knowledge for better health outcomes.",
    link: "/services/education"
  },
  {
    icon: <FaClinicMedical />,
    title: "Medical Services",
    description: "Providing essential medical services and treatments to improve the health and well-being of our citizens.",
    link: "/services/medical"
  },
  {
    icon: <FaAmbulance />,
    title: "Emergency Services",
    description: "24/7 emergency medical services to ensure rapid response and care during critical situations.",
    link: "/services/emergency"
  }
];

export default function ServiceGrid() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
          <div className="mt-2 w-24 h-1 bg-red-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
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
