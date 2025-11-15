import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, UserPlus, Stethoscope, CalendarCheck } from 'lucide-react';
import { mockDoctors, mockPatients, mockAppointments } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2 } from "lucide-react";


export default function ClinicAdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [step, setStep] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [doc, setDoc] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    specialization: '',
    experience: '',
    qualifications: '',
  });
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    password: '',
    email: '',
    age: '',
    gender: '',
    contact: '',
  });

  const navigate = useNavigate();

  // For patient selection
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form data
  const [scheduleData, setScheduleData] = useState({
    patientId: "",
    date: "",
    time: "",
    notes: "",
  });

  // Filter patients from your data
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };


  const API_DOCTORS = 'http://localhost:5000/api/clinicadmin/doctors';
  const API_PATIENTS = 'http://localhost:5000/api/clinicadmin/patients';
  const API_APPOINTMENTS = 'http://localhost:5000/api/clinicadmin/getAppointments';

  useEffect(() => {
    const fetchData = async () => {

      try {
        const token = localStorage.getItem('token');
        const doctorRes = await fetch(API_DOCTORS, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });


        if (!doctorRes.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const doctorData = await doctorRes.json();
        setDoctors(doctorData.doctors);


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


      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ title: 'Error', description: 'Failed to load appointments', variant: 'destructive' });
      }
    };

    fetchData();
  }, []);


  const handleScheduleAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(doc + token);

      const res = await fetch(`http://localhost:5000/api/clinicadmin/createAppointment/${doc}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to Schedule Appointment');

      toast({ title: 'Appointment Created', description: 'Appointment scheduled successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }

  };
  const handleCreateDoctor = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/clinicadmin/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create doctor');

      toast({ title: 'Doctor Created', description: 'Doctor added successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }

  };
  const handleCreatePatient = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/clinicadmin/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(patientFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create patient');

      toast({ title: 'patient Created', description: 'patient added successfully' });
      navigate("/");

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }

  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChangePatient = (e) => {
    setPatientFormData({ ...patientFormData, [e.target.name]: e.target.value });
  };
  const handleNext = () => {
    if (!formData.name || !formData.password || !formData.email) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setStep(2);
  };
  const handleNextPateint = () => {
    if (!patientFormData.name || !patientFormData.password || !patientFormData.email) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Clinic Admin Dashboard</h1>
          <p className="text-muted-foreground">Health Plus Clinic Management</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-zinc-100 dark:bg-zinc-700/40 
  transition-all duration-300 ease-in-out 
  hover:shadow-xl hover:-translate-y-1">
            <CardHeader className=" flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctors.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-100 dark:bg-blue-700/40 
  transition-all duration-300 ease-in-out 
  hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card >
          <Card className="bg-green-200 dark:bg-green-700/40 
  transition-all duration-300 ease-in-out 
  hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-200 dark:bg-orange-700/40 
  transition-all duration-300 ease-in-out 
  hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage and monitor all clinic appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt._id}>
                        <TableCell className="font-medium">
                          {apt.patientId?.name || "Unknown Patient"}
                        </TableCell>

                        <TableCell>
                          {apt.doctorId?.name || "Unknown Doctor"}
                        </TableCell>

                        <TableCell>
                          {new Date(apt.date).toLocaleDateString()}
                          {" "}
                          {apt.time}
                        </TableCell>

                        <TableCell>
                          <Badge className={getStatusColor(apt.status)}>
                            {apt.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Approve</Button>
                            <Button variant="outline" size="sm">Reschedule</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Doctors</CardTitle>
                    <CardDescription>Manage doctor profiles and schedules</CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
                    setDialogOpen(isOpen);

                    if (!isOpen) {

                      setStep(1);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        specialization: "",
                        experience: "",
                        qualifications: "",
                      });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Doctor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Doctors</DialogTitle>
                        <DialogDescription>Create a new Doctor and assign its credentials</DialogDescription>
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
                          <span className={step === 1 ? 'text-blue-600 font-medium' : ''}>Doctor Credential</span>
                          <span className={step === 2 ? 'text-blue-600 font-medium' : ''}>Doctor Info</span>
                        </div>
                      </div>


                      {/* Step 1: doctor credential */}
                      {step === 1 && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="space-y-2">
                            <Label htmlFor="name">Doctor Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="doctor@gmail.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="doctor@123" />
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={handleNext}>Next</Button>
                          </div>
                        </div>
                      )}

                      {/* Step 2: doctor Info */}
                      {step === 2 && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Neuro surgeon" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience">Experience</Label>
                            <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleChange} placeholder="2 year" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qualifications">Qualification</Label>
                            <Input id="qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange} placeholder="Enter qualification" />
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={handleCreateDoctor}>Create Doctor</Button>
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
                      <TableHead>Specialization</TableHead>
                      <TableHead>Qualifications</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow key={doctor._id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>

                        <TableCell>{doctor.doctorInfo?.specialization || "N/A"}</TableCell>

                        <TableCell>{doctor.doctorInfo?.qualifications || "N/A"}</TableCell>

                        <TableCell>{doctor.doctorInfo?.experience + " year" || "N/A"}</TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setScheduleDialogOpen(true);
                                setDoc(doctor._id);
                              }
                              }
                            >
                              Schedule
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                      <DialogContent className="max-w-[70vw]">
                        <DialogHeader>
                          <DialogTitle>Schedule Appointment</DialogTitle>
                          <DialogDescription>
                            Select a patient and schedule their appointment.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* ----------------------- STEP 1: PATIENT LIST ----------------------- */}
                          {!selectedPatient && (
                            <div className="space-y-3">
                              <Label>Select Patient</Label>

                              {/* Search bar */}
                              <Input
                                placeholder="Search patient..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                              />

                              {/* Patient list */}
                              <div className="max-h-80 overflow-y-auto border rounded-md p-2 space-y-2">
                                {filteredPatients.length > 0 ? (
                                  filteredPatients.map((p) => (
                                    <div
                                      key={p._id}
                                      onClick={() => {
                                        setSelectedPatient(p);
                                        setScheduleData((prev) => ({
                                          ...prev,
                                          patientId: p._id,
                                        }));
                                      }}
                                      className="p-2 border rounded-md cursor-pointer hover:bg-blue-100 transition"
                                    >
                                      <p className="font-medium">{p.name}</p>
                                      <p className="text-xs text-gray-500">{p.email}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-sm">No patient found.</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* ----------------------- STEP 2: DATE + TIME ----------------------- */}
                        {selectedPatient && !showNotes && (
                            <div className="space-y-8 animate-in fade-in duration-300">

                              {/* Patient Information Card */}
                              <div className="p-6 border border-blue-200 rounded-2xl bg-white shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Patient Information
                                  </p>

                                  <Button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm shadow-sm"
                                    onClick={() => {
                                      setSelectedPatient(null);
                                      setScheduleData({ patientId: "", date: "", time: "", notes: "" });
                                    }}
                                  >
                                    Change Patient
                                  </Button>
                                </div>

                                <div className="flex justify-between items-start">
                                  <div className="space-y-3">
                                    <h3 className="font-bold text-2xl text-gray-900">{selectedPatient.name}</h3>

                                    <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
                                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Age:</span> {selectedPatient.patientInfo.age}</p>
                                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Gender:</span> {selectedPatient.patientInfo.gender}</p>
                                      <p className="text-gray-700 col-span-2">
                                        <span className="font-semibold text-gray-900">Contact:</span> {selectedPatient.patientInfo.contact}
                                      </p>
                                    </div>
                                    </div>

                                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border border-blue-200 shadow-inner">
                                      <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.477 0 4.779.632 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                {/* Appointment Scheduling Form */}
                                <div className="p-6 border border-blue-100 rounded-2xl bg-blue-50/40 shadow-inner backdrop-blur-sm">
                                  <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeWidth={2} d="M8 7V3m8 4V3M5 11h14M5 19h14M5 11v8m14-8v8" />
                                    </svg>
                                    <p className="text-base font-semibold text-blue-900 tracking-wide">Appointment Details</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">

                                    {/* Date */}
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

                                    {/* Time */}
                                    <div className="space-y-2">
                                    <Label htmlFor="time-select" className="text-sm font-medium text-blue-900">Select Time</Label>
                                    <Input
                                      id="time-select"
                                      type="time"
                                      className="h-12 rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                                      value={scheduleData.time}
                                      onChange={(e) => setScheduleData((prev) => ({ ...prev, time: e.target.value }))}
                                    />

                                    <div className="flex justify-end pt-4">
                                      <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                                        onClick={() => {
                                          if (!scheduleData.date || !scheduleData.time) {
                                            toast({ title: "Missing Fields", description: "Please select both date and time.", variant: "destructive" });
                                            return;
                                          }
                                        
                                          setShowNotes(true);
                                        }}
                                      >
                                        NEXT
                                      </Button>
                                    </div>
                                  </div>

                                </div>
                              </div>

                            </div>
                          )}




                          {/* ----------------------- STEP 3: NOTES ----------------------- */}
                          {showNotes && (
                           <div className="space-y-3 animate-in fade-in duration-300">
                             <Label>Doctor Notes</Label>
                                                  
                             <textarea
                               className="w-full border p-2 rounded-md"
                               rows={4}
                               placeholder="Add notes about the patient..."
                               value={scheduleData.notes}
                               onChange={(e) =>
                                 setScheduleData((prev) => ({ ...prev, notes: e.target.value }))
                               }
                            />
                         
                             <div className="flex justify-between">
                               <Button
                                 variant="outline"
                                 onClick={() => setShowNotes(false)}
                               >
                                 Back
                               </Button>
                          
                               <Button
                                 onClick={() => {
                                   if (!doc) {
                                     toast({
                                       title: "Error",
                                       description: "Doctor not selected!",
                                       variant: "destructive"
                                     });
                                     return;
                                   }
                              
                                   handleScheduleAppointment();
                              
                                   setScheduleDialogOpen(false);
                                   setSelectedPatient(null);
                                   setScheduleData({ patientId: "", date: "", time: "", notes: "" });
                                   setDoc(null);
                                   setShowNotes(false);
                                 }}
                               >
                                 Save Appointment
                               </Button>
                                                    </div>
                                                   </div>
                         )}
                         
                        </div>
                      </DialogContent>
                    </Dialog>
                    );

                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Patients</CardTitle>
                    <CardDescription>Manage patient records</CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
                    setDialogOpen(isOpen);
                    if (!isOpen) {
                      setStep(1);
                      setPatientFormData({
                        name: "",
                        email: "",
                        password: "",
                        specialization: "",
                        experience: "",
                        qualifications: "",
                      });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Patient</DialogTitle>
                        <DialogDescription>Create a new Patient and assign its credentials</DialogDescription>
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
                          <span className={step === 1 ? 'text-blue-600 font-medium' : ''}>Patient credentials</span>
                          <span className={step === 2 ? 'text-blue-600 font-medium' : ''}>Patient Info</span>
                        </div>
                      </div>


                      {/* Step 1: Patient credentials */}
                      {step === 1 && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="space-y-2">
                            <Label htmlFor="name">Patient Name</Label>
                            <Input id="name" name="name" value={patientFormData.name} onChange={handleChangePatient} placeholder="Parth verma" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={patientFormData.email} onChange={handleChangePatient} placeholder="Pateint@gmail.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">password</Label>
                            <Input id="password" name="password" value={patientFormData.password} onChange={handleChangePatient} placeholder="********" />
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={handleNextPateint}>Next</Button>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Patient Info */}
                      {step === 2 && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" type="number" value={patientFormData.age} onChange={handleChangePatient} placeholder="18 year" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <select
                              id="gender"
                              name="gender"
                              value={patientFormData.gender}
                              onChange={handleChangePatient}
                              className="border rounded-lg p-2 w-full"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact">Contact</Label>
                            <Input id="contact" name="contact" type="number" value={patientFormData.contact} onChange={handleChangePatient} placeholder="989765XXXX" />
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={handleCreatePatient}>Create Patient</Button>
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
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>

                        <TableCell>{patient.patientInfo?.gender || "N/A"}</TableCell>

                        <TableCell>{patient.patientInfo?.age + " year" || "N/A"}</TableCell>


                        <TableCell>{patient.patientInfo?.contact || "N/A"}</TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
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

