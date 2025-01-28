'use client';

import Image from 'next/image';
import PageTitle from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';

export default function Component4Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Component 4" 
        subtitle="Contingent Emergency Response Component"
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
                  Component 4 serves as the Contingent Emergency Response Component (CERC) of the MHSSP. This component is designed to provide immediate response capability to address emergency healthcare needs and unforeseen health crises in Mizoram.
                </p>
                <p className="text-gray-600">
                  Through rapid mobilization of resources and coordinated response mechanisms, we ensure that the healthcare system can effectively respond to emergencies while maintaining essential services.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/images/c4.png"
                  alt="Component 4 Illustration"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Response Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Rapid Response",
                  description: "Quick deployment of resources and personnel during emergencies."
                },
                {
                  title: "Resource Mobilization",
                  description: "Efficient allocation and mobilization of emergency resources."
                },
                {
                  title: "Crisis Management",
                  description: "Coordinated approach to managing health emergencies."
                },
                {
                  title: "Emergency Services",
                  description: "Provision of essential emergency healthcare services."
                },
                {
                  title: "Communication",
                  description: "Effective emergency communication and coordination systems."
                },
                {
                  title: "Recovery Support",
                  description: "Assistance in post-emergency recovery and system restoration."
                }
              ].map((capability, index) => (
                <div key={index} className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Response Framework</h2>
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-red-100">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Preparation Phase</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">1</span>
                      </span>
                      <span className="text-gray-600">Risk assessment and planning</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">2</span>
                      </span>
                      <span className="text-gray-600">Resource stockpiling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">3</span>
                      </span>
                      <span className="text-gray-600">Staff training</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-red-100">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Response Phase</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">1</span>
                      </span>
                      <span className="text-gray-600">Emergency activation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">2</span>
                      </span>
                      <span className="text-gray-600">Resource deployment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">3</span>
                      </span>
                      <span className="text-gray-600">Service delivery</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-red-100">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Recovery Phase</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">1</span>
                      </span>
                      <span className="text-gray-600">System restoration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">2</span>
                      </span>
                      <span className="text-gray-600">Impact assessment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-600 text-sm">3</span>
                      </span>
                      <span className="text-gray-600">Lessons learned</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
