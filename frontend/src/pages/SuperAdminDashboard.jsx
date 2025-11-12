import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { mockClinics, mockUsers } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

export default function SuperAdminDashboard() {
  const [clinics, setClinics] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.name || !formData.location || !formData.description) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setStep(2);
  };

  const handleCreateClinic = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/superadmin/clinic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create clinic');

      toast({ title: 'Clinic Created', description: 'Clinic and admin added successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const API_CLINICS = 'http://localhost:5000/clinic';
  const API_USERS = 'http://localhost:5000/userinfo';

  useEffect(() => {
    const fetchData = async () => {

      try {
        // Fetch clinics
        const clinicRes = await fetch(API_CLINICS, {
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (!clinicRes.ok) {
          throw new Error('Failed to fetch clinics');
        }

        const clinicData = await clinicRes.json();
        setClinics(clinicData);


        // Fetch users
        const usersRes = await fetch(API_USERS, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!usersRes.ok) {
          throw new Error('Failed to fetch clinics');
        }

        const usersData = await usersRes.json();
        setUsers(usersData);


      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
      }
    };

    fetchData();
  }, []);


  const handleDeleteClinic = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/superadmin/clinics/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(res);
      if (!res.ok) throw new Error('Failed to delete clinic');
      setClinics((prevClinics) => prevClinics.filter((clinic) => clinic._id !== id));
      toast({ title: 'Clinic deleted', description: 'Clinic removed successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete clinic', variant: 'destructive' });
    }
  };


  return (

    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage clinics and administrators across the system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clinics</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinics.length}</div>
              <p className="text-xs text-muted-foreground">Across all locations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clinic Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinics.length}</div>
              <p className="text-xs text-muted-foreground">Active administrators</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length - 1}</div>
              <p className="text-xs text-muted-foreground">All system users</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clinics</CardTitle>
                <CardDescription>Manage clinic locations and administrators</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Clinic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Clinic</DialogTitle>
                    <DialogDescription>Create a new clinic and assign its administrator</DialogDescription>
                  </DialogHeader>

                  {/* Minimal Progress Timeline */}
                  <div className="mt-6 w-full">
                    {/* Progress Line */}
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className={`h-2 bg-blue-600 transition-all duration-500 rounded-full`}
                        style={{ width: step === 1 ? '50%' : '100%' }}
                      ></div>
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span className={step === 1 ? 'text-blue-600 font-medium' : ''}>Clinic Info</span>
                      <span className={step === 2 ? 'text-blue-600 font-medium' : ''}>Admin Info</span>
                    </div>
                  </div>


                  {/* Step 1: Clinic Info */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="name">Clinic Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Health Plus Clinic" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="123 Medical St, City" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Clinic specialized in..." />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleNext}>Next</Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Admin Info */}
                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="adminName">Admin Name</Label>
                        <Input id="adminName" name="adminName" value={formData.adminName} onChange={handleChange} placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminEmail">Admin Email</Label>
                        <Input id="adminEmail" name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} placeholder="admin@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminPassword">Admin Password</Label>
                        <Input id="adminPassword" name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} placeholder="Enter password" />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={handleCreateClinic}>Create Clinic</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>

              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic) => (
                  <TableRow key={clinic._id}>
                    <TableCell className="font-medium">{clinic.name}</TableCell>
                    <TableCell>{clinic.location}</TableCell>
                    <TableCell>{clinic.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClinic(clinic._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinic Administrators</CardTitle>
            <CardDescription>Manage admin user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic) =>
                  clinic.clinicAdmins.map((clinicAdminId) => {
                    const admin = users.find((user) => user._id === clinicAdminId);
                    if (!admin) return null;

                    return (
                      <TableRow key={admin._id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{clinic?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

