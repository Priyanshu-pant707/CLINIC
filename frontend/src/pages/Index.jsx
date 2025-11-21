
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Users, Shield, Stethoscope } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  //  Fetch clinics (no authentication required)
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch('http://localhost:5000/clinic');
        const data = await res.json();
        setClinics(data);
      } catch (err) {
        console.error('Error fetching clinics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold text-primary">
            <Activity className="h-6 w-6" />
            <span>ClinicFlow</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
    
        <h1 className="text-7xl font-bold text-gray-700 text-foreground mb-6">
          Dental Clinic Management System
        </h1>
        <p className="text-medium text-muted-foreground mb-8 max-w-2xl mx-auto">
          Streamline your healthcare operations with our comprehensive platform for managing appointments, 
          prescriptions, and patient care.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">View Demo</Link>
          </Button>
        </div>
      </section>

      {/*  New Section — Fetching data from localhost:5000/clinic */}
  <section className="border shadow-md  container mx-auto px-4 py-20 space-y-8">
  <h2 className="text-6xl font-bold  text-zinc-700 text-center mb-12 text-foreground">
     Available <span className='text-blue-400'>Clinics</span>
  </h2>

  {loading ? (
    <p className="text-center text-muted-foreground animate-pulse">
      Loading clinics...
    </p>
  ) : clinics.length === 0 ? (
    <p className="text-center text-muted-foreground">No clinics found.</p>
  ) : (
    clinics.map((clinic) => (
      <Card
        key={clinic._id}
        className="flex flex-col md:flex-row items-center md:items-start gap-6 border border-border/20 bg-card/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
      >
        {/* Clinic Image / Placeholder */}
        <div className="w-full md:w-48 h-48 bg-gradient-to-r from-primary/40 to-cyan-400/40 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
          {/* {clinic.name[0]} */}
          <img src="https://i.pinimg.com/736x/3b/df/57/3bdf5702d98a357455ff4027786c3d96.jpg" alt="" />
        </div>

        {/* Clinic Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl text-zinc-900  font-semibold text-primary">{clinic.name}</h3>
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                clinic.status === "active"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {clinic.status.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-blue-500 text-muted-foreground mb-4">
            {clinic.description || "No description available"}
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground mb-4">
            <p>👨‍⚕️ Doctors: {clinic.doctors.length}</p>
            <p>🧑‍🤝‍🧑 Patients: {clinic.patients.length}</p>
            <p>📍 {clinic.location}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground italic">
              Created on: {new Date(clinic.createdAt).toLocaleDateString()}
            </p>
            <Button size="sm" className="bg-primary hover:bg-cyan-400 text-white" asChild>
              <Link to={`/clinic/${clinic._id}`}>View Clinic</Link>
            </Button>
          </div>
        </div>
      </Card>
    ))
  )}
</section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features by Role</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Super Admin</CardTitle>
              <CardDescription>System-wide management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Manage multiple clinics</li>
                <li>• Oversee all administrators</li>
                <li>• System-wide analytics</li>
                <li>• User access control</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Clinic Admin</CardTitle>
              <CardDescription>Clinic operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Manage doctors & patients</li>
                <li>• Appointment scheduling</li>
                <li>• Staff management</li>
                <li>• Clinic reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Stethoscope className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Doctor</CardTitle>
              <CardDescription>Patient care</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Manage appointments</li>
                <li>• Create prescriptions</li>
                <li>• Patient history</li>
                <li>• Schedule management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Patient</CardTitle>
              <CardDescription>Healthcare access</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Book appointments</li>
                <li>• Find doctors</li>
                <li>• View prescriptions</li>
                <li>• Medical history</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>



      <section className="bg-card border-y border-border py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join healthcare professionals using ClinicFlow to deliver better patient care
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2025 ClinicFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
