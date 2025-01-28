'use client';

import Image from 'next/image';
import PageTitle from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';

export default function Component1Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Component 1" 
        subtitle="Strengthen Management & Accountability through Internal Performance Agreements"
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
                  Component 1 focuses on strengthening the management and accountability mechanisms within the healthcare system through Internal Performance Agreements (IPAs). This component is designed to improve the efficiency and effectiveness of healthcare delivery by establishing clear performance metrics and accountability frameworks.
                </p>
                <p className="text-gray-600">
                  Through these agreements, we aim to create a more responsive and responsible healthcare system that better serves the needs of Mizoram's population.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/images/c1.png"
                  alt="Component 1 Illustration"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Objectives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Performance Monitoring",
                  description: "Establish robust systems for monitoring and evaluating healthcare service delivery performance."
                },
                {
                  title: "Accountability Framework",
                  description: "Develop and implement clear accountability mechanisms at all levels of healthcare administration."
                },
                {
                  title: "Capacity Building",
                  description: "Strengthen institutional capacity for effective management and decision-making."
                },
                {
                  title: "Quality Assurance",
                  description: "Implement quality control measures and standards for healthcare service delivery."
                },
                {
                  title: "Resource Optimization",
                  description: "Improve resource allocation and utilization through performance-based management."
                },
                {
                  title: "Stakeholder Engagement",
                  description: "Foster collaboration and communication between different levels of healthcare administration."
                }
              ].map((objective, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{objective.title}</h3>
                  <p className="text-gray-600">{objective.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Expected Outcomes</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600">✓</span>
                </span>
                <span className="text-gray-600">Improved healthcare service delivery efficiency and effectiveness</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600">✓</span>
                </span>
                <span className="text-gray-600">Enhanced accountability in healthcare administration</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600">✓</span>
                </span>
                <span className="text-gray-600">Better resource utilization and management</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600">✓</span>
                </span>
                <span className="text-gray-600">Strengthened institutional capacity for healthcare management</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
