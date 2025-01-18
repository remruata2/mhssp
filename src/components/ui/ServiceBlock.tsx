'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

interface ServiceBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

export default function ServiceBlock({ icon, title, description, link }: ServiceBlockProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center h-full"
    >
      <div className="text-4xl text-blue-900 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      {link && (
        <div className="mt-auto">
          <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Read More <FaArrowRight className="ml-2 text-sm" />
          </span>
        </div>
      )}
    </motion.div>
  );

  return link ? (
    <Link href={link} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}
