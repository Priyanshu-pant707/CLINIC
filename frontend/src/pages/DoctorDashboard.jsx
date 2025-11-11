import { useState } from 'react';
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

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments] = useState(mockAppointments.filter(a => a.doctorName === user?.name));
  const [prescriptions] = useState(mockPrescriptions.filter(p => p.doctorName === user?.name));

  const todayAppointments = appointments.filter(a => {
    const aptDate = new Date(a.datetime).toDateString();
    const today = new Date().toDateString();
    return aptDate === today;
  });

  const handleAcceptAppointment = (id) => {
    toast({ title: 'Appointment accepted', description: 'Patient will be notified' });
  };

  const handleCreatePrescription = () => {
    toast({ title: 'Prescription created', description: 'Prescription saved successfully' });
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
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
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
              <div className="text-2xl font-bold">{prescriptions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>Manage your appointment schedule</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Prescription
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
                            <Label>Patient Name</Label>
                            <Input placeholder="Select patient" />
                          </div>
                          <div className="space-y-2">
                            <Label>Appointment</Label>
                            <Input placeholder="Select appointment" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Medicine 1</Label>
                          <div className="grid grid-cols-4 gap-2">
                            <Input placeholder="Name" className="col-span-2" />
                            <Input placeholder="Dose" />
                            <Input placeholder="Duration" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea placeholder="Additional instructions..." rows={4} />
                        </div>
                        <div className="space-y-2">
                          <Label>Follow-up Date</Label>
                          <Input type="date" />
                        </div>
                        <Button className="w-full" onClick={handleCreatePrescription}>
                          Create Prescription
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
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
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.patientName}</TableCell>
                        <TableCell>{new Date(apt.datetime).toLocaleString()}</TableCell>
                        <TableCell>{apt.reason}</TableCell>
                        <TableCell>
                          <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                            {apt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {apt.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleAcceptAppointment(apt.id)}>
                                Accept
                              </Button>
                              <Button variant="outline" size="sm">Reject</Button>
                            </div>
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
                      <TableRow key={presc.id}>
                        <TableCell className="font-medium">{presc.patientName}</TableCell>
                        <TableCell>{new Date(presc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{presc.medicines.length} medicines</TableCell>
                        <TableCell>
                          {presc.followUpDate ? new Date(presc.followUpDate).toLocaleDateString() : 'N/A'}
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
        </Tabs>
      </main>
    </div>
  );
}

