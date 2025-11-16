import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { mockAppointments, mockPrescriptions } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    diagnosis: '',
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" },],
    advice: '',
  });

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dosage: "", frequency: "", duration: "" }
      ],
    });
  };
  const updateMedicine = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;

    setFormData({
      ...formData,
      medicines: updated,
    });
  };

  const removeMedicine = (index) => {
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updated });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAcceptAppointment = (id) => {
    toast({ title: 'Appointment accepted', description: 'Patient will be notified' });
  };

  const handleCreatePrescription = async (id) => {
    try {
      console.log(formData);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/doctor/prescription/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)

      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add Prescription');

      toast({ title: 'Prescription created', description: 'Prescription saved successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };
  const handleUpdatePrescription = async() => {
    console.log("Updated Prescription:");

    try {
      console.log(formData);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/doctor/prescription/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)

      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add Prescription');

      toast({ title: 'Prescription created', description: 'Prescription saved successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }

    setOpen(false);
  };



  const API_PATIENTS = 'http://localhost:5000/api/doctor/patients';
  const API_APPOINTMENTS = 'http://localhost:5000/api/doctor/appointment';
  const API_PRESCRIPTION = 'http://localhost:5000/api/doctor/prescriptions';
  useEffect(() => {
    const fetchData = async () => {

      try {
        const token = localStorage.getItem('token');
        const patientRes = await fetch(API_PATIENTS, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!patientRes.ok) {
          throw new Error('Failed to fetch clinics');
        }

        const patientData = await patientRes.json();
        setPatients(patientData.patients);

        const appointmentRes = await fetch(API_APPOINTMENTS, {
          method: 'get',
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
          method: 'get',
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


  const changeStatus = async (st, id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/appointment/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: st })

      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change status');

      toast({ title: 'status changed', description: 'status changed successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'approved').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>Manage your appointment schedule</CardDescription>
                  </div>

                </div>
              </CardHeader>

              <Tabs defaultValue="upcoming" className="space-y-6 ml-8">
                <TabsList>
                  <TabsTrigger value="upcoming">upcoming</TabsTrigger>
                  <TabsTrigger value="completed">completed</TabsTrigger>
                  <TabsTrigger value="cancelled">cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.filter((apt) => apt.status !== "completed" && apt.status !== "cancelled")
                          .map((apt) => (
                            <TableRow key={apt._id}>
                              <TableCell className="font-medium">{apt.patientId.name}</TableCell>
                              <TableCell>{new Date(apt.date).toLocaleString()}</TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View</Button>

                                  </DialogTrigger>

                                  <DialogContent className="max-w-md rounded-xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-bold text-blue-700">
                                        Notes
                                      </DialogTitle>
                                    </DialogHeader>

                                    <div className="mt-4 p-4 bg-blue-100 rounded-lg shadow-inner border-l-4 border-blue-500">
                                      {apt.notes ? (
                                        <p className="text-blue-900 whitespace-pre-wrap font-medium">
                                          {apt.notes}
                                        </p>
                                      ) : (
                                        <p className="text-blue-600 italic">No notes available.</p>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell>
                                <Badge variant={apt.status === 'approved' ? 'default' : 'secondary'}>
                                  {apt.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {apt.status === 'pending' ? (
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => changeStatus("approved", apt._id)}>
                                      Accept
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => changeStatus("cancelled", apt._id)}
                                    >Reject</Button>
                                  </div>
                                ) : (
                                  <div className="flex gap-2">



                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" >
                                          Complete
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle>Create Prescription</DialogTitle>
                                          <DialogDescription>Write a prescription for your patient</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="name">Patient Name</Label>
                                              <Input defaultValue={apt.patientId.name} />
                                            </div>
                                          </div>


                                          <div className="max-h-40 overflow-y-auto pr-2 space-y-4">
                                            {formData.medicines.map((med, index) => (
                                              <div
                                                key={index}
                                                className="space-y-2 border p-4 rounded-xl bg-gray-50"
                                              >
                                                <Label className="font-medium">Medicine {index + 1}</Label>

                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                  <Input
                                                    placeholder="Name"
                                                    value={med.name}
                                                    onChange={(e) =>
                                                      updateMedicine(index, "name", e.target.value)
                                                    }
                                                  />

                                                  <Input
                                                    placeholder="Dosage"
                                                    value={med.dosage}
                                                    onChange={(e) =>
                                                      updateMedicine(index, "dosage", e.target.value)
                                                    }
                                                  />

                                                  <Input
                                                    placeholder="Frequency"
                                                    value={med.frequency}
                                                    onChange={(e) =>
                                                      updateMedicine(index, "frequency", e.target.value)
                                                    }
                                                  />

                                                  <Input
                                                    placeholder="Duration"
                                                    value={med.duration}
                                                    onChange={(e) =>
                                                      updateMedicine(index, "duration", e.target.value)
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          <div className="flex justify-center">
                                            <Button
                                              type="button"
                                              variant="outline"
                                              className="flex items-center gap-2 text-purple-600 border-purple-600"
                                              onClick={addMedicine}
                                            >
                                              <Plus className="w-4 h-4" /> Add Medicine
                                            </Button>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="diagnosis">diagnosis</Label>
                                            <Input id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="diagnosis" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="advice">advice</Label>
                                            <Input id="advice" name="advice" value={formData.advice} onChange={handleChange} placeholder="advice" />
                                          </div>
                                          <Button className="w-full" onClick={() => {

                                            handleCreatePrescription(apt._id);
                                            // changeStatus("completed", apt._id);
                                          }
                                          }>
                                            Create Prescription
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <Button variant="outline" size="sm" onClick={() => changeStatus("cancelled", apt._id)}
                                    >Reject</Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </TabsContent>
                <TabsContent value="completed">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.filter((apt) => apt.status === "completed")
                          .map((apt) => (
                            <TableRow key={apt._id}>
                              <TableCell className="font-medium">{apt.patientId.name}</TableCell>
                              <TableCell>{new Date(apt.date).toLocaleString()}</TableCell>
                              <TableCell>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View</Button>

                                  </DialogTrigger>

                                  <DialogContent className="max-w-md rounded-xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-bold text-blue-700">
                                        Notes
                                      </DialogTitle>
                                    </DialogHeader>

                                    <div className="mt-4 p-4 bg-blue-100 rounded-lg shadow-inner border-l-4 border-blue-500">
                                      {apt.notes ? (
                                        <p className="text-blue-900 whitespace-pre-wrap font-medium">
                                          {apt.notes}
                                        </p>
                                      ) : (
                                        <p className="text-blue-600 italic">No notes available.</p>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>



                              </TableCell>
                              <TableCell>
                                <Badge variant={'secondary'}>
                                  {apt.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" >
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Create Prescription</DialogTitle>
                                      <DialogDescription>Write a prescription for your patient</DialogDescription>
                                    </DialogHeader>
                                    {prescriptions
                                      .filter((presc) => presc._id === apt.prescriptions[0])
                                      .map((presc) => (
                                        <div key={presc._id} className="space-y-4">

                                          {/* Patient Details */}
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="name">Patient Name</Label>
                                              <Input defaultValue={apt.patientId.name} />
                                            </div>
                                          </div>

                                          {/* Medicines */}
                                          <div className="max-h-40 overflow-y-auto pr-2 space-y-4">
                                            {presc.medicines.map((med, index) => (
                                              <div
                                                key={index}
                                                className="space-y-2 border p-4 rounded-xl bg-gray-50 relative"
                                              >
                                                {/* Remove Button */}
                                                <button
                                                  type="button"
                                                  onClick={() => removeMedicine(index)}
                                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                >
                                                  <X className="w-4 h-4" />
                                                </button>

                                                <Label className="font-medium">Medicine {index + 1}</Label>

                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                  <Input
                                                    placeholder="Name"
                                                    value={med.name}
                                                    onChange={(e) => updateMedicine(index, "name", e.target.value)}
                                                  />
                                                  <Input
                                                    placeholder="Dosage"
                                                    value={med.dosage}
                                                    onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                                                  />
                                                  <Input
                                                    placeholder="Frequency"
                                                    value={med.frequency}
                                                    onChange={(e) =>
                                                      updateMedicine(index, "frequency", e.target.value)
                                                    }
                                                  />
                                                  <Input
                                                    placeholder="Duration"
                                                    value={med.duration}
                                                    onChange={(e) =>
                                                      updateMedicine(index, "duration", e.target.value)
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {/* Add Medicine */}
                                          <div className="flex justify-center">
                                            <Button
                                              type="button"
                                              variant="outline"
                                              className="flex items-center gap-2 text-purple-600 border-purple-600"
                                              onClick={addMedicine}
                                            >
                                              <Plus className="w-4 h-4" /> Add Medicine
                                            </Button>
                                          </div>

                                          {/* Diagnosis */}
                                          <div className="space-y-2">
                                            <Label htmlFor="diagnosis">Diagnosis</Label>
                                            <Input
                                              id="diagnosis"
                                              name="diagnosis"
                                              value={presc.diagnosis}
                                              onChange={handleChange}
                                              placeholder="diagnosis"
                                            />
                                          </div>

                                          {/* Advice */}
                                          <div className="space-y-2">
                                            <Label htmlFor="advice">Advice</Label>
                                            <Input
                                              id="advice"
                                              name="advice"
                                              value={presc.advice}
                                              onChange={handleChange}
                                              placeholder="advice"
                                            />
                                          </div>
                                        </div>
                                      ))}

                                    <Button className="w-full" onClick={() => {

                                      handleUpdatePrescription(apt._id);
                                      // changeStatus("completed", apt._id);
                                    }
                                    }>
                                      Create Prescription
                                    </Button>
                                  </DialogContent>
                                </Dialog>

                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </TabsContent>
                <TabsContent value="cancelled">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.filter((apt) => apt.status === "cancelled")
                          .map((apt) => (
                            <TableRow key={apt._id}>
                              <TableCell className="font-medium">{apt.patientId.name}</TableCell>
                              <TableCell>{new Date(apt.date).toLocaleString()}</TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View</Button>

                                  </DialogTrigger>

                                  <DialogContent className="max-w-md rounded-xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-bold text-blue-700">
                                        Notes
                                      </DialogTitle>
                                    </DialogHeader>

                                    <div className="mt-4 p-4 bg-blue-100 rounded-lg shadow-inner border-l-4 border-blue-500">
                                      {apt.notes ? (
                                        <p className="text-blue-900 whitespace-pre-wrap font-medium">
                                          {apt.notes}
                                        </p>
                                      ) : (
                                        <p className="text-blue-600 italic">No notes available.</p>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell>
                                <Badge variant={apt.status === 'approved' ? 'default' : 'secondary'}>
                                  {apt.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>My Prescriptions</CardTitle>
                <CardDescription>View all prescriptions you've created</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Medicines</TableHead>
                      <TableHead>Follow-up</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((presc) => (
                      <TableRow key={presc._id}>
                        <TableCell className="font-medium">{presc.patientId.name}</TableCell>
                        <TableCell>{new Date(presc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{presc.medicines.length} medicines</TableCell>
                        <TableCell>
                          {presc.diagnosis}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patients</CardTitle>
                <CardDescription>View all Patients </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.patientInfo.age}</TableCell>
                        <TableCell>{patient.patientInfo.gender}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.patientInfo.contact}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div >
  );
}

