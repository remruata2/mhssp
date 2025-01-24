'use client';

import Image from 'next/image';
import { FaHospital, FaUserMd, FaHandsHelping, FaChartLine } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Mizoram Health Systems Strengthening Project
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Transforming Healthcare Delivery in Mizoram
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              The Mizoram Health Systems Strengthening Project (MHSSP) is a comprehensive initiative 
              aimed at improving healthcare infrastructure, service delivery, and accessibility 
              across the state of Mizoram.
            </p>
            <p className="text-lg text-gray-600">
              Supported by the World Bank, our project focuses on enhancing healthcare systems, 
              improving medical facilities, and ensuring quality healthcare reaches every corner 
              of Mizoram.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="/images/mhssp-hospital.jpg" 
              alt="MHSSP Healthcare Facility" 
              width={600} 
              height={400} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Key Focus Areas</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { 
                icon: FaHospital, 
                title: 'Infrastructure Development', 
                description: 'Upgrading and modernizing healthcare facilities across Mizoram.' 
              },
              { 
                icon: FaUserMd, 
                title: 'Healthcare Workforce', 
                description: 'Training and capacity building for medical professionals.' 
              },
              { 
                icon: FaHandsHelping, 
                title: 'Community Engagement', 
                description: 'Promoting community participation in healthcare initiatives.' 
              },
              { 
                icon: FaChartLine, 
                title: 'Health System Strengthening', 
                description: 'Improving overall healthcare management and delivery systems.' 
              }
            ].map((area, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <area.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            We are dedicated to creating a robust, accessible, and high-quality healthcare 
            system that meets the unique needs of Mizoram&apos;s diverse population.
          </p>
        </div>
      </div>
    </div>
  );
}
