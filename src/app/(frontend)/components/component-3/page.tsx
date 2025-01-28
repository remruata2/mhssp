'use client';

import Image from 'next/image';
import PageTitle from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';

export default function Component3Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Component 3" 
        subtitle="Quality of Health Service and Innovations"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 mb-4">
                  Component 3 is focused on enhancing the quality of health services through innovative approaches and continuous improvement. This component aims to introduce and implement modern healthcare practices and technologies to improve service delivery.
                </p>
                <p className="text-gray-600">
                  By fostering innovation and maintaining high quality standards, we work to ensure that the people of Mizoram receive the best possible healthcare services.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/images/c3.png"
                  alt="Component 3 Illustration"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Innovation Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Digital Health",
                  description: "Implementation of electronic health records and telemedicine solutions."
                },
                {
                  title: "Quality Standards",
                  description: "Development and enforcement of healthcare quality standards and protocols."
                },
                {
                  title: "Service Integration",
                  description: "Integration of various health services for comprehensive care delivery."
                },
                {
                  title: "Healthcare Analytics",
                  description: "Use of data analytics for improved decision-making and service planning."
                },
                {
                  title: "Patient Experience",
                  description: "Enhancement of patient experience through innovative service delivery models."
                },
                {
                  title: "Clinical Excellence",
                  description: "Promotion of clinical excellence through best practices and continuous learning."
                }
              ].map((area, index) => (
                <div key={index} className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quality Improvement Initiatives</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Clinical Quality Improvement",
                  description: "Implementation of evidence-based practices and clinical protocols to enhance patient care quality.",
                  metrics: ["Reduced medical errors", "Improved patient outcomes", "Standardized care protocols"]
                },
                {
                  title: "Service Delivery Innovation",
                  description: "Introduction of innovative service delivery models to improve healthcare accessibility and efficiency.",
                  metrics: ["Reduced waiting times", "Increased patient satisfaction", "Improved service coverage"]
                },
                {
                  title: "Technology Integration",
                  description: "Adoption of modern healthcare technologies to enhance service delivery and patient care.",
                  metrics: ["Digital health records adoption", "Telemedicine utilization", "Healthcare analytics implementation"]
                }
              ].map((initiative, index) => (
                <div key={index} className="border border-purple-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">{initiative.title}</h3>
                  <p className="text-gray-600 mb-4">{initiative.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {initiative.metrics.map((metric, i) => (
                      <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
