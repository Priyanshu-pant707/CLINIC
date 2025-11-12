
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
    
        <h1 className="text-6xl font-bold text-gray-700 text-foreground mb-6">
          Modern Clinic Management System
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
     <section className="container mx-auto px-4 py-20 bg-gray-100 border shadow-lg flex flex-wrap flex-col">
  <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
    🏥 Available Clinics
  </h2>

  {loading ? (
    <p className="text-center text-muted-foreground animate-pulse">
      Loading clinics...
    </p>
  ) : clinics.length === 0 ? (
    <p className="text-center text-muted-foreground">No clinics found.</p>
  ) : (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {clinics.map((clinic) => (
        <Card
          key={clinic._id}
          className="group relative  border border-border/40 bg-card/60 backdrop-blur-md hover:border-primary/60 
                     transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 rounded-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/90">
                {clinic.name}
              </CardTitle>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  clinic.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {clinic.status}
              </span>
            </div>
            <CardDescription className="text-muted-foreground mt-1">
              📍 {clinic.location}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {clinic.description || "No description available"}
            </p>

            <div className="space-y-1 text-sm">
              <p>
                <strong className="text-foreground">👨‍⚕️ Doctors:</strong>{" "}
                <span className="text-muted-foreground">
                  {clinic.doctors.length}
                </span>
              </p>
              <p>
                <strong className="text-foreground">🧑‍🤝‍🧑 Patients:</strong>{" "}
                <span className="text-muted-foreground">
                  {clinic.patients.length}
                </span>
              </p>
            </div>

            <p className="text-xs text-muted-foreground mt-4 italic">
              Created on:{" "}
              <span className="text-foreground">
                {new Date(clinic.createdAt).toLocaleDateString()}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
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
