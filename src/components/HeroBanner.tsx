"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Healthcare in Mizoram"
          fill
          priority
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-3 mb-6 leading-tight">
              Improving Management Capacity and Quality of Health Services in
              Mizoram
            </h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
              Empowering communities through innovative healthcare solutions,
              modern facilities, and sustainable development initiatives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/about"
              className="px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center group"
            >
              Learn More
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/services"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Our Services
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-8"
          >
            {[
              { number: "10+", label: "NQAS Certified Hospitals" },
              { number: "500+", label: "Medical Professionals" },
              { number: "50K+", label: "Patients Served" },
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-3xl font-bold">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
