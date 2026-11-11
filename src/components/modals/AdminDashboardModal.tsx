import React, { useState, useEffect } from 'react';
import type { Appointment } from '../../types';
import { INITIAL_APPOINTMENTS } from '../../data/clinicData';
import { 
  X, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Mail, 
  Phone, 
  RefreshCw
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load appointments from localStorage or defaults
  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem('dentivo_appointments');
      if (stored) {
        const parsed: Appointment[] = JSON.parse(stored);
        setAppointments(parsed);
      } else {
        localStorage.setItem('dentivo_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
        setAppointments(INITIAL_APPOINTMENTS);
      }
    } catch {
      setAppointments(INITIAL_APPOINTMENTS);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateStatus = (id: string, newStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    sound.playClick();
    const updated = appointments.map((app) => (app.id === id ? { ...app, status: newStatus } : app));
    setAppointments(updated);
    try {
      localStorage.setItem('dentivo_appointments', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleResetData = () => {
    sound.playClick();
    localStorage.setItem('dentivo_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    setAppointments(INITIAL_APPOINTMENTS);
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden border"
        style={{
          backgroundColor: colors.bgDark,
          borderColor: `${colors.accent}40`,
        }}
      >
        {/* Modal Top Bar */}
        <div 
          className="p-6 border-b flex items-center justify-between"
          style={{
            backgroundColor: colors.primary,
            borderColor: `${colors.accent}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: `${colors.secondary}80`,
                borderColor: `${colors.accent}50`,
                color: colors.accent,
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Dentivo Staff Portal</h3>
                <span 
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.accent,
                    borderColor: `${colors.accent}40`,
                  }}
                >
                  Live Clinic Sync
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Centralized appointment booking schedule & patient intake registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              title="Reset Sample Records"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-b text-xs"
          style={{
            backgroundColor: `${colors.primary}60`,
            borderColor: `${colors.accent}15`,
          }}
        >
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-white/60 uppercase text-[10px] block">Total Bookings</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">{appointments.length}</span>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-white/60 uppercase text-[10px] block">Confirmed</span>
            <span className="text-lg font-bold font-mono mt-0.5 block" style={{ color: colors.accent }}>{confirmedCount}</span>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-white/60 uppercase text-[10px] block">Action Pending</span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">{pendingCount}</span>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-white/60 uppercase text-[10px] block">Chair Availability</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">82%</span>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div 
          className="p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{
            backgroundColor: `${colors.primary}90`,
            borderColor: `${colors.accent}15`,
          }}
        >
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.accent }} />
            <input
              type="text"
              placeholder="Search patient, code, or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 border focus:outline-none"
              style={{
                backgroundColor: `${colors.secondary}50`,
                borderColor: `${colors.accent}30`,
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  sound.playClick();
                  setStatusFilter(st);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all border ${
                  statusFilter === st
                    ? 'shadow-sm font-bold border-transparent'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                }`}
                style={
                  statusFilter === st
                    ? { backgroundColor: colors.accent, color: colors.primary }
                    : undefined
                }
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-white/50 text-xs">
              <Calendar className="w-8 h-8 text-white/30 mb-2" />
              <p>No appointments match the current filter or search criteria.</p>
            </div>
          ) : (
            filteredAppointments.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl p-4 sm:p-5 border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                style={{
                  backgroundColor: `${colors.primary}70`,
                  borderColor: `${colors.accent}25`,
                }}
              >
                {/* Patient & Service details */}
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs"
                    style={{
                      backgroundColor: colors.secondary,
                      borderColor: `${colors.accent}40`,
                      color: colors.accent,
                    }}
                  >
                    {app.patientName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{app.patientName}</h4>
                      <span 
                        className="font-mono text-[10px] px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${colors.accent}15`,
                          color: colors.accent,
                          borderColor: `${colors.accent}30`,
                        }}
                      >
                        {app.referenceCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 mt-1">
                      <span className="font-medium text-white">{app.serviceName}</span>
                      <span>•</span>
                      <span>{app.doctorName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/60 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" style={{ color: colors.accent }} /> {app.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" style={{ color: colors.accent }} /> {app.phone}
                      </span>
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-white/70 italic mt-2 bg-black/20 px-2.5 py-1 rounded-lg">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Schedule & Status Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                  <div className="text-left lg:text-right">
                    <span className="text-xs font-bold text-white block">{app.date}</span>
                    <span className="text-[11px] block" style={{ color: colors.accent }}>{app.timeSlot}</span>
                  </div>

                  {/* Status Dropdown / Action buttons */}
                  <div className="flex items-center gap-1.5">
                    {app.status !== 'confirmed' && (
                      <button
                        onClick={() => updateStatus(app.id, 'confirmed')}
                        title="Confirm Appointment"
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{
                          backgroundColor: `${colors.accent}25`,
                          color: colors.accent,
                        }}
                      >
                        Confirm
                      </button>
                    )}
                    {app.status !== 'completed' && (
                      <button
                        onClick={() => updateStatus(app.id, 'completed')}
                        title="Mark Completed"
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    {app.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(app.id, 'cancelled')}
                        title="Cancel Appointment"
                        className="px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
