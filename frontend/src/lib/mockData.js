export const mockUsers = [
  { id: '1', name: 'Super Admin', email: 'admin@clinic.com', role: 'super_admin' },
  { id: '2', name: 'John Clinic', email: 'john@healthclinic.com', role: 'clinic_admin', clinicId: 'clinic1' },
  { id: '3', name: 'Dr. Sarah Smith', email: 'sarah@healthclinic.com', role: 'doctor', clinicId: 'clinic1' },
  { id: '4', name: 'Dr. Mike Johnson', email: 'mike@healthclinic.com', role: 'doctor', clinicId: 'clinic1' },
  { id: '5', name: 'Alice Patient', email: 'alice@email.com', role: 'patient' },
  { id: '6', name: 'Bob Patient', email: 'bob@email.com', role: 'patient' },
];

export const mockClinics = [
  { id: 'clinic1', name: 'Health Plus Clinic', address: '123 Medical St, City', phone: '555-0100', adminId: '2' },
  { id: 'clinic2', name: 'Care Center', address: '456 Wellness Ave, Town', phone: '555-0200', adminId: '2' },
];

export const mockDoctors = [
  {
    id: 'doc1',
    userId: '3',
    name: 'Dr. Sarah Smith',
    specialization: 'Cardiology',
    qualifications: 'MD, FACC',
    clinicId: 'clinic1',
    availability: ['Monday 9:00-17:00', 'Wednesday 9:00-17:00', 'Friday 9:00-17:00'],
  },
  {
    id: 'doc2',
    userId: '4',
    name: 'Dr. Mike Johnson',
    specialization: 'Pediatrics',
    qualifications: 'MD, FAAP',
    clinicId: 'clinic1',
    availability: ['Tuesday 10:00-18:00', 'Thursday 10:00-18:00', 'Saturday 9:00-13:00'],
  },
];

export const mockPatients = [
  {
    id: 'pat1',
    userId: '5',
    name: 'Alice Patient',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    contact: '555-1234',
  },
  {
    id: 'pat2',
    userId: '6',
    name: 'Bob Patient',
    dateOfBirth: '1985-08-22',
    gender: 'Male',
    contact: '555-5678',
  },
];

export const mockAppointments = [
  {
    id: 'apt1',
    patientId: 'pat1',
    patientName: 'Alice Patient',
    doctorId: 'doc1',
    doctorName: 'Dr. Sarah Smith',
    clinicId: 'clinic1',
    datetime: '2025-11-15T10:00:00',
    status: 'confirmed',
    reason: 'Routine checkup',
  },
  {
    id: 'apt2',
    patientId: 'pat2',
    patientName: 'Bob Patient',
    doctorId: 'doc2',
    doctorName: 'Dr. Mike Johnson',
    clinicId: 'clinic1',
    datetime: '2025-11-16T14:00:00',
    status: 'pending',
    reason: 'Consultation',
  },
  {
    id: 'apt3',
    patientId: 'pat1',
    patientName: 'Alice Patient',
    doctorId: 'doc1',
    doctorName: 'Dr. Sarah Smith',
    clinicId: 'clinic1',
    datetime: '2025-11-10T11:00:00',
    status: 'completed',
    reason: 'Follow-up',
  },
];

export const mockPrescriptions = [
  {
    id: 'presc1',
    appointmentId: 'apt3',
    doctorId: 'doc1',
    doctorName: 'Dr. Sarah Smith',
    patientId: 'pat1',
    patientName: 'Alice Patient',
    medicines: [
      { name: 'Aspirin', dose: '100mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Vitamin D', dose: '1000 IU', frequency: 'Once daily', duration: '90 days' },
    ],
    notes: 'Continue current medication. Follow up in 3 months.',
    followUpDate: '2026-02-10',
    createdAt: '2025-11-10T11:30:00',
  },
];

