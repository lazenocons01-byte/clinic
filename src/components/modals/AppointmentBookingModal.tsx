import React, { useState, useEffect } from 'react';
import { SERVICES, DOCTORS, TIME_SLOTS } from '../../data/clinicData';
import type { Appointment } from '../../types';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  FileDown, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedDoctorId,
  onBookingSuccess,
}) => {
  const { colors } = useTheme();
  const [step, setStep] = useState<number>(1);
  const [serviceId, setServiceId] = useState<string>(preselectedServiceId || SERVICES[0].id);
  const [doctorId, setDoctorId] = useState<string>(preselectedDoctorId || DOCTORS[0].id);
  const [date, setDate] = useState<string>('2026-11-18');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0].time);
  const [patientName, setPatientName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    if (preselectedServiceId) setServiceId(preselectedServiceId);
  }, [preselectedServiceId]);

  useEffect(() => {
    if (preselectedDoctorId) setDoctorId(preselectedDoctorId);
  }, [preselectedDoctorId]);

  if (!isOpen) return null;

  const validateStep = (currentStep: number) => {
    const errs: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!serviceId) errs.service = 'Please select a dental service';
    } else if (currentStep === 2) {
      if (!doctorId) errs.doctor = 'Please select a preferred specialist';
      if (!date) errs.date = 'Please pick a consultation date';
      if (!timeSlot) errs.time = 'Please pick a time slot';
    } else if (currentStep === 3) {
      if (!patientName.trim()) errs.name = 'Full name is required';
      if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
      if (!phone.trim() || phone.length < 8) errs.phone = 'Valid phone number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    sound.playClick();
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    sound.playClick();
    setStep((prev) => prev - 1);
  };

  const handleConfirmBooking = () => {
    if (!validateStep(3)) return;

    sound.playSuccess();

    // Celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [colors.accent, colors.mint, '#ffffff'],
    });

    const selectedService = SERVICES.find((s) => s.id === serviceId);
    const selectedDoctor = DOCTORS.find((d) => d.id === doctorId);

    const refCode = `DEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      referenceCode: refCode,
      patientName,
      email,
      phone,
      serviceId,
      serviceName: selectedService ? selectedService.name : 'Dental Consultation',
      doctorId,
      doctorName: selectedDoctor ? selectedDoctor.name : 'First Available Specialist',
      date,
      timeSlot,
      status: 'confirmed',
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('dentivo_appointments');
      const list: Appointment[] = stored ? JSON.parse(stored) : [];
      list.unshift(newAppointment);
      localStorage.setItem('dentivo_appointments', JSON.stringify(list));
    } catch {
      // Ignore
    }

    setConfirmedBooking(newAppointment);
    onBookingSuccess?.(newAppointment);
    setStep(4);
  };

  const downloadCalendarFile = () => {
    if (!confirmedBooking) return;
    sound.playClick();

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dentivo Dental Center//Appointment//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Dentivo Appointment - ${confirmedBooking.serviceName}`,
      `DESCRIPTION:Appointment with ${confirmedBooking.doctorName}. Reference: ${confirmedBooking.referenceCode}`,
      'LOCATION:Dentivo Dental Center, 450 Lexington Ave, Suite 1800, New York, NY 10017',
      `DTSTART:${confirmedBooking.date.replace(/-/g, '')}T140000Z`,
      `DTEND:${confirmedBooking.date.replace(/-/g, '')}T150000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Dentivo_Appointment_${confirmedBooking.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="border rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
        style={{ backgroundColor: colors.primary, borderColor: `${colors.accent}40` }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Progress Header */}
        {step < 4 && (
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: colors.accent }}>
              <Sparkles className="w-3 h-3" />
              Direct Clinical Concierge Booking
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Schedule Your Visit
            </h3>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                      step >= s ? '' : 'bg-white/15'
                    }`}
                    style={{ backgroundColor: step >= s ? colors.accent : undefined }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-white/60 mt-1 uppercase font-semibold">
              <span>1. Treatment</span>
              <span>2. Date & Time</span>
              <span>3. Details</span>
            </div>
          </div>
        )}

        {/* STEP 1: Select Dental Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Select Required Dental Treatment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {SERVICES.map((srv) => {
                const isSelected = srv.id === serviceId;
                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      sound.playClick();
                      setServiceId(srv.id);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${colors.secondary}bb` : undefined,
                      borderColor: isSelected ? colors.accent : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-white">{srv.name}</span>
                      <span className="text-[10px] font-mono font-semibold" style={{ color: colors.accent }}>{srv.startingPrice}</span>
                    </div>
                    <p className="text-[11px] text-white/70 mt-1 line-clamp-1">{srv.tagline}</p>
                    <span className="text-[10px] text-white/50 block mt-2">{srv.duration}</span>
                  </div>
                );
              })}
            </div>
            {errors.service && <p className="text-xs text-red-400">{errors.service}</p>}
          </div>
        )}

        {/* STEP 2: Doctor & Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-white block mb-2">Preferred Doctor</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DOCTORS.map((doc) => {
                  const isSelected = doc.id === doctorId;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        sound.playClick();
                        setDoctorId(doc.id);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'shadow-sm'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${colors.secondary}bb` : undefined,
                        borderColor: isSelected ? colors.accent : undefined,
                      }}
                    >
                      <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{doc.name}</span>
                        <span className="text-[10px] block truncate" style={{ color: colors.accent }}>{doc.specialization}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-2">Consultation Date</label>
              <input
                type="date"
                value={date}
                min="2026-11-10"
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                style={{ borderColor: `${colors.accent}50` }}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-2">Preferred Time Slot</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => {
                      sound.playClick();
                      setTimeSlot(slot.time);
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                      !slot.available
                        ? 'opacity-30 bg-white/5 cursor-not-allowed line-through text-white/40'
                        : timeSlot === slot.time
                        ? 'text-[#063D32] shadow-sm font-bold'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/5'
                    }`}
                    style={{
                      backgroundColor: timeSlot === slot.time ? colors.accent : undefined,
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Patient Information */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Your Contact Details</h4>
            
            <div>
              <label className="text-xs font-medium text-white/80 block mb-1">Full Legal Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: colors.accent }} />
                <input
                  type="text"
                  placeholder="e.g. Alexandra Smith"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                  style={{ borderColor: `${colors.accent}40` }}
                />
              </div>
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-white/80 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: colors.accent }} />
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                    style={{ borderColor: `${colors.accent}40` }}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-white/80 block mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: colors.accent }} />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                    style={{ borderColor: `${colors.accent}40` }}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/80 block mb-1">Dental Concerns or Special Requests</label>
              <textarea
                rows={3}
                placeholder="Describe any symptoms, previous treatments, or dental anxiety accommodations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none resize-none"
                style={{ borderColor: `${colors.accent}40` }}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Success Confirmation Screen */}
        {step === 4 && confirmedBooking && (
          <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div 
              className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${colors.accent}20`, borderColor: colors.accent, color: colors.accent }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.accent }}>
              Appointment Confirmed
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              We Look Forward to Welcoming You!
            </h3>
            <p className="text-xs text-white/70 max-w-md mx-auto mt-2">
              A clinical confirmation and pre-visit intake package have been transmitted to <strong className="text-white">{confirmedBooking.email}</strong>.
            </p>

            <div 
              className="rounded-2xl p-5 border my-6 text-left max-w-md mx-auto space-y-2.5 text-xs"
              style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40` }}
            >
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/70">Booking Reference:</span>
                <span className="font-mono font-bold" style={{ color: colors.accent }}>{confirmedBooking.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Patient:</span>
                <span className="font-semibold text-white">{confirmedBooking.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Service:</span>
                <span className="font-semibold text-white">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Specialist:</span>
                <span className="font-semibold text-white">{confirmedBooking.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Schedule:</span>
                <span className="font-semibold" style={{ color: colors.accent }}>{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={downloadCalendarFile}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <FileDown className="w-4 h-4" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Stepper Bottom Controls */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-6 border-t border-white/15 mt-6">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[#063D32] text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-md"
                style={{ backgroundColor: colors.accent }}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[#063D32] text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <span>Confirm Appointment</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
