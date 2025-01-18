'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaFileDownload, FaBuilding } from 'react-icons/fa';

interface TenderDetails {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  closingDate: string;
  status: 'active' | 'closed';
  referenceNo: string;
  description: string;
  documents: {
    name: string;
    url: string;
    size: string;
  }[];
  eligibilityCriteria: string[];
}

export default function TenderDetailsPage({ params }: { params: { id: string } }) {
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call - replace with actual API call
    setTender({
      id: params.id,
      title: 'Construction of Primary Health Center Building',
      category: 'Civil Works',
      publishDate: '2025-01-10',
      closingDate: '2025-02-10',
      status: 'active',
      referenceNo: 'MHSSP/CW/2025/001',
      description: `This tender is for the construction of a new Primary Health Center building in the specified location. 
      The project includes all civil works, electrical installations, plumbing, and basic medical infrastructure setup.
      
      The successful bidder will be responsible for:
      - Complete construction of the building as per approved plans
      - Installation of electrical and plumbing systems
      - Basic medical infrastructure setup
      - Site development and landscaping`,
      documents: [
        {
          name: 'Tender Document',
          url: '/documents/tender.pdf',
          size: '2.5 MB'
        },
        {
          name: 'Technical Specifications',
          url: '/documents/specs.pdf',
          size: '1.8 MB'
        },
        {
          name: 'Bill of Quantities',
          url: '/documents/boq.pdf',
          size: '1.2 MB'
        }
      ],
      eligibilityCriteria: [
        'Must have completed at least 3 similar projects in the last 5 years',
        'Must have valid registration with the relevant authorities',
        'Must have minimum annual turnover of INR 5 Crores',
        'Must have necessary technical staff and equipment'
      ]
    });
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Tender not found</h1>
            <p className="mt-2 text-gray-600">The tender you're looking for doesn't exist or has been removed.</p>
            <Link href="/procurement" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" /> Back to Procurement Notices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/procurement"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Procurement Notices
        </Link>

        {/* Tender Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              tender.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {tender.status === 'active' ? 'Active' : 'Closed'}
            </span>
            <span className="text-sm text-gray-500">{tender.referenceNo}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{tender.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FaBuilding className="mr-2" />
              {tender.category}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Published: {new Date(tender.publishDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Closing: {new Date(tender.closingDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tender Description */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="prose max-w-none">
            {tender.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {tender.eligibilityCriteria.map((criteria, index) => (
              <li key={index}>{criteria}</li>
            ))}
          </ul>
        </div>

        {/* Tender Documents */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tender Documents</h2>
          <div className="space-y-3">
            {tender.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <FaFileDownload className="text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.size}</p>
                  </div>
                </div>
                <a
                  href={doc.url}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
