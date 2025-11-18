import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, FileText, Search, Plus, Download } from 'lucide-react';
import { mockDoctors, mockAppointments, mockPrescriptions } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [clinicId, setClinicId] = useState();
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const handleBookAppointment = async (doc) => {

    try {
      const token = localStorage.getItem('token');
      console.log(doc + token);

      const res = await fetch(`http://localhost:5000/api/patient/appointments/${doc}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to Schedule Appointment');


      toast({ title: 'Appointment requested', description: 'Waiting for doctor confirmation' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDownloadPrescription = (id) => {
    toast({ title: 'Download started', description: 'Prescription PDF will download shortly' });
  };


  const API_USERS = 'http://localhost:5000/userinfo';
  const API_APPOINTMENTS = 'http://localhost:5000/api/patient/appointments';
  const API_PRESCRIPTION = 'http://localhost:5000/api/patient/prescription';

  useEffect(() => {
    const fetchData = async () => {

      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem("user"));

        setClinicId(user.clinicId);
        const usersRes = await fetch(API_USERS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (!usersRes.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const usersData = await usersRes.json();

        setUsers(usersData);



        const appointmentRes = await fetch(API_APPOINTMENTS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });


        if (!appointmentRes.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const appointmentData = await appointmentRes.json();
        setAppointments(appointmentData.data);

        const prescriptionRes = await fetch(API_PRESCRIPTION, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });


        if (!prescriptionRes.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const prescriptionData = await prescriptionRes.json();
        setPrescriptions(prescriptionData.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ title: 'Error', description: 'Failed to load appointments', variant: 'destructive' });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prescriptions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Search Doctors</CardTitle>
                <CardDescription>Find and book appointments with doctors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input placeholder="Search by name or specialization..." className="flex-1" />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {users.filter((doc) => doc.role === "doctor" && doc.clinic === clinicId)
                    .map((doc) => (
                      <Card key={doc._id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{doc.name}</CardTitle>
                          <CardDescription>
                            {doc.doctorInfo.specialization} • {doc.doctorInfo.qualifications}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">email:</p>
                            {doc.email}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full mt-4">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Book Appointment
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Book Appointment</DialogTitle>
                                  <DialogDescription>
                                    Schedule an appointment with {doc.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="date-select" className="text-sm font-medium text-blue-900">Select Date</Label>
                                    <Input
                                      id="date-select"
                                      type="date"
                                      className="h-12 rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                                      value={scheduleData.date}
                                      onChange={(e) => setScheduleData((prev) => ({ ...prev, date: e.target.value }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="time-select" className="text-sm font-medium text-blue-900">Select Time</Label>
                                    <Input
                                      id="time-select"
                                      type="time"
                                      className="h-12 rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                                      value={scheduleData.time}
                                      onChange={(e) => setScheduleData((prev) => ({ ...prev, time: e.target.value }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Reason for Visit</Label>
                                    <textarea
                                      className="w-full border p-2 rounded-md"
                                      rows={4}
                                      placeholder="Reason for Visit"
                                      value={scheduleData.notes}
                                      onChange={(e) =>
                                        setScheduleData((prev) => ({ ...prev, notes: e.target.value }))
                                      }
                                    />
                                  </div>
                                  <Button className="w-full" onClick={() => { handleBookAppointment(doc._id) }}>
                                    Request Appointment
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.doctorId.name}</TableCell>

                        <TableCell>
                          {apt.date && apt.time
                            ? new Date(`${apt.date.split("T")[0]}T${apt.time}`).toLocaleString()
                            : "N/A"}
                        </TableCell>

                        <TableCell>{apt.notes}</TableCell>
                        <TableCell>
                          <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                            {apt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {apt.status === 'pending' || apt.status === 'confirmed' ? (
                            <Button variant="outline" size="sm">Cancel</Button>
                          ) : (
                            <Button variant="outline" size="sm">View</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>My Prescriptions</CardTitle>
                <CardDescription>View and download your prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Medicines</TableHead>
                      <TableHead>Follow-up</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((presc) => (
                      <TableRow key={presc._id}>
                        <TableCell className="font-medium">{presc.doctorId.name}</TableCell>
                        <TableCell>{new Date(presc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {presc.medicines.map(m => m.name).join(', ')}
                        </TableCell>

                        <TableCell>
                          {presc.appointmentId.date && presc.appointmentId.time
                            ? new Date(`${presc.appointmentId.date.split("T")[0]}T${presc.appointmentId.time}`).toLocaleString()
                            : "N/A"}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="font-medium border-blue-500 text-blue-600 hover:bg-blue-50"
                                >
                                  View
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-w-xl rounded-2xl shadow-2xl p-6 bg-gradient-to-b from-blue-50 to-white">
                                <DialogHeader>
                                  <DialogTitle className="text-3xl font-bold text-blue-700">
                                    Prescription Details
                                  </DialogTitle>
                                  <DialogDescription className="text-sm text-blue-600">
                                    Full medical prescription and doctor information
                                  </DialogDescription>
                                </DialogHeader>

                                {presc && (
                                  <div className="space-y-6">

                                    {/* Doctor Section */}
                                    <div className="rounded-xl p-4 bg-white shadow-lg border-l-4 border-blue-500">
                                      <h3 className="font-bold text-xl text-blue-700 flex items-center gap-2">
                                        👨‍⚕️ Doctor
                                      </h3>
                                      <p className="mt-1 text-gray-800 font-semibold">{presc.doctorId?.name}</p>
                                      <p className="text-gray-600 text-sm">📧 {presc.doctorId?.email}</p>
                                    </div>

                                    {/* Diagnosis */}
                                    <div className="rounded-xl p-4 bg-white shadow-lg border-l-4 border-green-500">
                                      <h3 className="font-bold text-xl text-green-700 flex items-center gap-2">
                                        🩺 Diagnosis
                                      </h3>
                                      <p className="text-gray-700 mt-1 text-sm font-medium">
                                        {presc.diagnosis || "N/A"}
                                      </p>
                                    </div>

                                    {/* Medicines */}
                                    <div className="rounded-xl p-4 bg-white shadow-lg border-l-4 border-purple-500">
                                      <h3 className="font-bold text-xl text-purple-700 flex items-center gap-2">
                                        💊 Medicines
                                      </h3>

                                      <div className="space-y-4 mt-3">
                                        {presc.medicines.map((med) => (
                                          <div
                                            key={med._id}
                                            className="p-4 rounded-xl shadow-md bg-gradient-to-r from-purple-50 to-white border border-purple-200"
                                          >
                                            <p className="font-semibold text-lg text-purple-700">{med.name}</p>
                                            <p className="text-gray-700 text-sm mt-1">
                                              🔹 <strong>Dosage:</strong> {med.dosage}
                                            </p>
                                            <p className="text-gray-700 text-sm">
                                              🔹 <strong>Frequency:</strong> {med.frequency}
                                            </p>
                                            <p className="text-gray-700 text-sm">
                                              🔹 <strong>Duration:</strong> {med.duration}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Advice */}
                                    <div className="rounded-xl p-4 bg-white shadow-lg border-l-4 border-yellow-500">
                                      <h3 className="font-bold text-xl text-yellow-700 flex items-center gap-2">
                                        💡 Advice
                                      </h3>
                                      <p className="text-gray-800 mt-1 text-sm font-medium">
                                        {presc.advice || "N/A"}
                                      </p>
                                    </div>

                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button variant="outline" size="sm" onClick={() => handleDownloadPrescription(presc._id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

