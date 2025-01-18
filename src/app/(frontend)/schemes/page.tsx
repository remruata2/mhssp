export default function SchemesPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Healthcare Schemes</h1>
        
        <div className="space-y-8">
          {/* Featured Scheme */}
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  Featured Scheme
                </span>
                <h2 className="text-2xl font-semibold mb-2">Universal Health Coverage</h2>
                <p className="text-gray-600 mb-4">
                  Comprehensive healthcare coverage for all citizens, ensuring access to quality medical services.
                </p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          </div>

          {/* Other Schemes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Maternal Healthcare Scheme</h3>
              <p className="text-gray-600 mb-4">
                Support for expecting mothers including regular check-ups and nutritional assistance.
              </p>
              <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Child Immunization Program</h3>
              <p className="text-gray-600 mb-4">
                Free vaccination program for children aged 0-5 years.
              </p>
              <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Senior Citizen Health Card</h3>
              <p className="text-gray-600 mb-4">
                Special healthcare benefits for citizens above 60 years of age.
              </p>
              <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Rural Health Mission</h3>
              <p className="text-gray-600 mb-4">
                Improving healthcare infrastructure and services in rural areas.
              </p>
              <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Eligibility Criteria</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Must be a resident of the state</li>
              <li>Valid identification proof required</li>
              <li>Income certificate for income-based schemes</li>
              <li>Age proof for age-specific schemes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
