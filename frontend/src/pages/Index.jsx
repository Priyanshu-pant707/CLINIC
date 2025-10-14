import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/ui/Index_Hero_Card'
import { Search, Shield, Calendar, FileText, Share2, Clock } from 'lucide-react';
const Index = () => {


      const features = [
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'अपॉइंटमेंट बुक करें और मैनेज करें / Book and manage appointments easily',
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'सभी रिकॉर्ड एक जगह / All your medical records in one place',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'रिकॉर्ड शेयर करें / Share records securely with doctors',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'पूरी तरह सुरक्षित / Your data is completely secure',
    },
    {
      icon: Clock,
      title: 'Quick Access',
      description: 'कभी भी कहीं भी / Access your records anytime, anywhere',
    },
  ];




  return (
   <div className='min-h-screen'>
    <Navbar/>
 
    <main className='pt-24 pb-16'>

      
        {/* herosection */}
        <section className='container mx-auto px-4 py-16 text-center'>
           
            <div className='max-w-4xl mx-auto animate-fade-in'>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
              Your Health, All Connected !
            </h1>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              आपकी सेहत, आपके हाथ में। Multiple clinics, one platform. 
              Access your complete medical history, book appointments, and manage your healthcare journey.
            </p>

         <Card/>


            </div>
        </section>

        {/* features section */}

<section className='container mx-auto px-4 py-16'>
    <h2 className='text-3xl font-bold text-center mb-12'>
        Why Choose Gemis
    </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 border rounded-md  hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-accent/10"
              >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 flex items-center justify-center mb-4">
  <feature.icon className="w-6 h-6 text-white" />
</div>

                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
    </section>

               











               <section className="container mx-auto px-4 py-16">
  <div className="p-12 text-center shadow-lg rounded-xl bg-gradient-to-br from-blue-100 via-blue-200 to-blue-500">
    <h2 className="text-3xl font-bold mb-4">
      Ready to Get Started?
    </h2>
    <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
      Join thousands of patients managing their healthcare digitally
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        className="px-8 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all duration-300"
        // onClick={() => navigate('/signup')}
      >
        Create Account
      </button>
      <button
        className="px-8 py-3 border border-blue-400 text-blue-400 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-300"
        // onClick={() => navigate('/login')}
      >
        Sign In
      </button>
    </div>
  </div>
</section>

    </main> 



      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Gemis Health. सभी अधिकार सुरक्षित / All rights reserved.</p>
        </div>
      </footer>


   </div>
  )
}

export default Index