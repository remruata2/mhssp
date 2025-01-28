'use client';

import Image from 'next/image';
import PageTitle from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';

export default function Component2Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle 
        title="Component 2" 
        subtitle="Improve Design and Management of Health Insurance Programs"
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
                  Component 2 is dedicated to enhancing the design and management of health insurance programs in Mizoram. This component aims to improve healthcare accessibility and affordability by developing and implementing effective health insurance schemes.
                </p>
                <p className="text-gray-600">
                  Through comprehensive health insurance coverage, we strive to protect citizens from financial hardship while ensuring access to quality healthcare services.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/images/c2.png"
                  alt="Component 2 Illustration"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Focus Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Program Design",
                  description: "Develop comprehensive health insurance schemes tailored to local needs."
                },
                {
                  title: "Coverage Expansion",
                  description: "Increase the reach of health insurance programs to cover more beneficiaries."
                },
                {
                  title: "Claims Management",
                  description: "Streamline claims processing and settlement procedures."
                },
                {
                  title: "Risk Management",
                  description: "Implement effective risk assessment and management strategies."
                },
                {
                  title: "Beneficiary Education",
                  description: "Raise awareness about insurance benefits and procedures among beneficiaries."
                },
                {
                  title: "Provider Network",
                  description: "Expand and strengthen the network of healthcare providers."
                }
              ].map((area, index) => (
                <div key={index} className="bg-emerald-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits and Impact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Beneficiaries</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </span>
                    <span className="text-gray-600">Reduced out-of-pocket healthcare expenses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </span>
                    <span className="text-gray-600">Better access to quality healthcare services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </span>
                    <span className="text-gray-600">Protection against catastrophic health expenditure</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Healthcare System</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </span>
                    <span className="text-gray-600">Improved healthcare financing mechanisms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </span>
                    <span className="text-gray-600">Enhanced quality of healthcare delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </span>
                    <span className="text-gray-600">Strengthened provider accountability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
