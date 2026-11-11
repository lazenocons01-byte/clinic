import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { WhyChooseUsSection } from './components/sections/WhyChooseUsSection';
import { SmileGallerySection } from './components/sections/SmileGallerySection';
import { ServicesSection } from './components/sections/ServicesSection';
import { AnatomySection } from './components/sections/AnatomySection';
import { TechnologySection } from './components/sections/TechnologySection';
import { DentalAssessmentSection } from './components/sections/DentalAssessmentSection';
import { DoctorsSection } from './components/sections/DoctorsSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { Footer } from './components/layout/Footer';
import { AppointmentBookingModal } from './components/modals/AppointmentBookingModal';
import { AdminDashboardModal } from './components/modals/AdminDashboardModal';

function ClinicMain() {
  const { colors } = useTheme();
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>();

  const openBookingForService = (serviceId: string) => {
    setPreselectedService(serviceId);
    setPreselectedDoctor(undefined);
    setIsBookingOpen(true);
  };

  const openBookingForDoctor = (doctorId: string) => {
    setPreselectedDoctor(doctorId);
    setPreselectedService(undefined);
    setIsBookingOpen(true);
  };

  const openBookingForServiceAndDoctor = (serviceId: string, doctorId: string) => {
    setPreselectedService(serviceId);
    setPreselectedDoctor(doctorId);
    setIsBookingOpen(true);
  };

  const handleGeneralBooking = () => {
    setPreselectedService(undefined);
    setPreselectedDoctor(undefined);
    setIsBookingOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="min-h-screen text-[#EAF8F3] relative font-sans transition-colors duration-700"
      style={{ backgroundColor: colors.primary }}
    >
      {/* Global Navigation */}
      <Navbar
        onOpenBooking={handleGeneralBooking}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* 1. Hero Section with Central 3D Interactive Tooth */}
        <HeroSection
          onOpenBooking={handleGeneralBooking}
          onNavigateSection={scrollToSection}
        />

        {/* 2. Why Choose Us (Four Floating Glass Cards + Live Counters) */}
        <WhyChooseUsSection />

        {/* 3. Before & After Smile Transformations Slider */}
        <SmileGallerySection onOpenBooking={handleGeneralBooking} />

        {/* 4. Discover What's Inside Your Tooth (3D Anatomy Section) */}
        <AnatomySection onOpenBooking={handleGeneralBooking} />

        {/* 5. Comprehensive Dental Services */}
        <ServicesSection onSelectServiceForBooking={openBookingForService} />

        {/* 6. Advanced Clinical Technology & AI Simulator */}
        <TechnologySection />

        {/* 7. Interactive 60-Second Dental Diagnostic Assessment */}
        <DentalAssessmentSection onSelectServiceAndDoctor={openBookingForServiceAndDoctor} />

        {/* 8. Elite Doctor Specialists */}
        <DoctorsSection onSelectDoctorForBooking={openBookingForDoctor} />

        {/* 9. Verified Patient Testimonials Carousel */}
        <TestimonialsSection />
      </main>

      {/* Global Footer & Emergency Hotline */}
      <Footer onOpenBooking={handleGeneralBooking} />

      {/* Interactive Appointment Booking Modal */}
      <AppointmentBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId={preselectedService}
        preselectedDoctorId={preselectedDoctor}
      />

      {/* Clinic Staff Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ClinicMain />
    </ThemeProvider>
  );
}

export default App;
