import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Search } from 'lucide-react';

const Clinics = () => {

    const [clinic, setClinic] = useState([]);
    const [filteredClinics, setFilteredClinics] = useState([]);
    const [searchQuery, SetSearchQuery] = useState('');

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const res = await axios.get('');
                setClinic(res.data);
                setFilteredClinics(red.data);
            } catch (err) {
                console.error('Error fetching clinic:', err);
                alert('Can not able to fetch the data from the backed');
            }
        };
        fetchClinics();
    }, [])


    // filtering the clinics by name /appid / city

    const handleSearch = (query) => {
        SetSearchQuery(query);
        const filtered = Clinic.filter((c) =>
            c.name?.toLowerCase().includes(query.toLowerCase())
            ||
            c.appId?.toLowerCase().includes(query.toLowerCase())
            ||
            c.location?.tolowerCase().includes(query.toLowerCase())
        );
        setFilteredClinics(filtered);
    }

    return (
        <div className='min-h-screen bg-background'>
            <Navbar />
            <main className='pt-24 pb-16'>
                <div className='container mx-auto px-4'>
                    <div className='max-w-6xl mx-auto'>
                        <h1 className='text-4xl font-bold mb-8 text-center '>
                            Find Your Clinic
                        </h1>

                        {/* search bar */}

                        <div className='border border-gray-300 rounded-md  p-8 mb-8 shadow-medium'>
                            <div className=' flex gap-4'>
                                <div className='  relative flex-1'>
                                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text muted foregound' />
                                    <input type="text"
                                        placeholder="क्लिनिक का नाम या App ID खोजें / Search by name or App ID"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className=' border bg-slate-100  w-full pl-10 h-12  focus:outline-none focus:ring-0 focus:border-gray-400'
                                    />
                                </div>
                            </div>

                        </div>


                        {/* clinic list */}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClinics.length > 0 ? (
                                filteredClinics.map((Clinic) => (
                                    <div key={Clinic._id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <h2 className="text-xl font-semibold mb-2">{Clinic.name}</h2>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            <strong>App ID:</strong> {Clinic.appId}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            <strong>City:</strong> {Clinic.city}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Address:</strong> {Clinic.address}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    कोई क्लिनिक नहीं मिला / No clinics found
                                </p>
                            )}
                        </div>




                    </div>
                </div>
            </main>
        </div>
    )
}

export default Clinics