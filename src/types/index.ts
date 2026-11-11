export interface Doctor {
  id: string;
  name: string;
  title: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  image: string;
  rating: number;
  reviewCount: number;
  completedCases: number;
  bio: string;
  education: string[];
  certifications: string[];
  availableDays: string[];
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  category: 'Preventative' | 'Restorative' | 'Cosmetic' | 'Surgical' | 'Pediatric';
  description: string;
  fullOverview: string;
  duration: string;
  recoveryTime: string;
  recommendedFrequency: string;
  startingPrice: string;
  benefits: string[];
  steps: { stepNumber: number; title: string; description: string }[];
  highlight: string;
}

export interface TechnologyItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  clinicalImpact: string;
  specs: string[];
  accuracy: string;
  iconName: string;
}

export interface Appointment {
  id: string;
  referenceCode: string;
  patientName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface AnatomyLayer {
  id: string;
  name: string;
  scientificName: string;
  subtitle: string;
  cameraPosition: [number, number, number];
  hotspotPosition: [number, number, number];
  color: string;
  hardness: string;
  thickness: string;
  description: string;
  primaryFunction: string;
  composition: string;
  clinicalRisks: string[];
  careGuidelines: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  location: string;
  treatment: string;
  rating: number;
  review: string;
  date: string;
  avatar: string;
  verified: boolean;
}

