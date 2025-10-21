

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import axios from 'axios';

const Clinics = () => {
  const [clinics, setClinics] = useState([]);             // lowercase 'clinics'
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');     // lowercase 'setSearchQuery'

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/clinic'); // backend route
        setClinics(res.data);
        setFilteredClinics(res.data);
      } catch (err) {
        console.error('Error fetching clinics:', err);
        alert('Cannot fetch data from backend');
      }
    };

    fetchClinics();
  }, []);

  // filtering the clinics by name / appId / city
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = clinics.filter((c) =>
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.appId?.toLowerCase().includes(query.toLowerCase()) ||
      c.city?.toLowerCase().includes(query.toLowerCase())      // fixed typo
    );
    setFilteredClinics(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Find Your Clinic
            </h1>

            {/* Search Bar */}
            <div className="border border-gray-300 rounded-md p-8 mb-8 shadow-medium">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="क्लिनिक का नाम या App ID खोजें / Search by name or App ID"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border bg-slate-100 w-full pl-10 h-12 focus:outline-none focus:ring-0 focus:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Clinic List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClinics.length > 0 ? (
                filteredClinics.map((clinic) => (
                  <div
                    key={clinic._id}
                    className="p-6 shadow-lg hover:shadow-xl transition-shadow rounded-xl bg-white"
                  >
                    <h2 className="text-xl font-semibold mb-2">{clinic.name}</h2>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>App ID:</strong> {clinic.appId}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>City:</strong> {clinic.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Address:</strong> {clinic.address}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  कोई क्लिनिक नहीं मिला / No clinics found
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clinics;
