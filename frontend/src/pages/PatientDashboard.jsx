import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
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
  const [doctors] = useState(mockDoctors);
  const [appointments] = useState(mockAppointments.filter(a => a.patientName === 'Alice Patient'));
  const [prescriptions] = useState(mockPrescriptions.filter(p => p.patientName === 'Alice Patient'));

  const handleBookAppointment = () => {
    toast({ title: 'Appointment requested', description: 'Waiting for doctor confirmation' });
  };

  const handleDownloadPrescription = (id) => {
    toast({ title: 'Download started', description: 'Prescription PDF will download shortly' });
  };

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
                  {doctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription>
                          {doctor.specialization} • {doctor.qualifications}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Available:</p>
                          {doctor.availability.map((slot, idx) => (
                            <Badge key={idx} variant="outline" className="mr-2">
                              {slot}
                            </Badge>
                          ))}
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
                                  Schedule an appointment with {doctor.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Date</Label>
                                  <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Time Slot</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="10:00">10:00 AM</SelectItem>
                                      <SelectItem value="11:00">11:00 AM</SelectItem>
                                      <SelectItem value="14:00">2:00 PM</SelectItem>
                                      <SelectItem value="15:00">3:00 PM</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Reason for Visit</Label>
                                  <Textarea placeholder="Describe your symptoms..." rows={3} />
                                </div>
                                <Button className="w-full" onClick={handleBookAppointment}>
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
                        <TableCell className="font-medium">{apt.doctorName}</TableCell>
                        <TableCell>{new Date(apt.datetime).toLocaleString()}</TableCell>
                        <TableCell>{apt.reason}</TableCell>
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
                      <TableRow key={presc.id}>
                        <TableCell className="font-medium">{presc.doctorName}</TableCell>
                        <TableCell>{new Date(presc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {presc.medicines.map(m => m.name).join(', ')}
                        </TableCell>
                        <TableCell>
                          {presc.followUpDate ? new Date(presc.followUpDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadPrescription(presc.id)}>
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

