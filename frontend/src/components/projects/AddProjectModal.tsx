import React, { useState } from 'react';
import {
  X,
  Plus,
  Building2,
  Layers,
  MapPin,
  Calendar,
  Coins,
  FileText,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { createProject, CreateProjectPayload } from '../../services/api';
import { useToast } from '../common/Toast';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MINISTRIES = [
  { id: 1, name: 'Ministry of Railways (MoR)', code: 'MoR' },
  { id: 2, name: 'Ministry of Road Transport and Highways (MoRTH)', code: 'MoRTH' },
  { id: 3, name: 'Ministry of Power (MoP)', code: 'MoP' },
  { id: 4, name: 'Ministry of Petroleum and Natural Gas (MoPNG)', code: 'MoPNG' },
  { id: 5, name: 'Ministry of Housing and Urban Affairs (MoHUA)', code: 'MoHUA' },
  { id: 6, name: 'Ministry of Ports, Shipping and Waterways (MoPSW)', code: 'MoPSW' }
];

const SECTORS = [
  { id: 1, name: 'Railways', code: 'RAIL' },
  { id: 2, name: 'Road Transport & Highways', code: 'ROAD' },
  { id: 3, name: 'Power & Renewable Energy', code: 'POW' },
  { id: 4, name: 'Petroleum & Natural Gas', code: 'PET' },
  { id: 5, name: 'Urban Transport & Metro', code: 'URB' },
  { id: 6, name: 'Shipping & Ports', code: 'PORT' }
];

const STATES = [
  { id: 1, name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
  { id: 2, name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
  { id: 3, name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
  { id: 4, name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { id: 5, name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
  { id: 6, name: 'Andhra Pradesh', lat: 15.9129, lng: 79.74 },
  { id: 7, name: 'West Bengal', lat: 22.9868, lng: 87.855 },
  { id: 8, name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569 },
  { id: 9, name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
  { id: 10, name: 'Bihar', lat: 25.0961, lng: 85.3131 },
  { id: 11, name: 'Odisha', lat: 20.9517, lng: 85.0985 },
  { id: 12, name: 'Telangana', lat: 18.1124, lng: 79.0193 },
  { id: 13, name: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { id: 14, name: 'Assam', lat: 26.2006, lng: 92.9376 },
  { id: 15, name: 'Delhi (NCT)', lat: 28.7041, lng: 77.1025 },
  { id: 16, name: 'Haryana', lat: 29.0588, lng: 76.0856 },
  { id: 17, name: 'Punjab', lat: 31.1471, lng: 75.3412 },
  { id: 18, name: 'Jharkhand', lat: 23.6102, lng: 85.2799 },
  { id: 19, name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661 },
  { id: 20, name: 'Jammu & Kashmir', lat: 33.7782, lng: 76.5762 }
];

const AGENCIES = [
  { id: 1, name: 'National Highways Authority of India (NHAI)', code: 'NHAI' },
  { id: 2, name: 'Rail Vikas Nigam Limited (RVNL)', code: 'RVNL' },
  { id: 3, name: 'NTPC Limited (NTPC)', code: 'NTPC' },
  { id: 4, name: 'Oil and Natural Gas Corporation (ONGC)', code: 'ONGC' },
  { id: 5, name: 'Delhi Metro Rail Corporation (DMRC)', code: 'DMRC' },
  { id: 6, name: 'Dedicated Freight Corridor Corporation (DFCCIL)', code: 'DFCCIL' },
  { id: 7, name: 'Power Grid Corporation of India (POWERGRID)', code: 'POWERGRID' },
  { id: 8, name: 'Indian Oil Corporation Limited (IOCL)', code: 'IOCL' },
  { id: 9, name: 'National Capital Region Transport Corp (NCRTC)', code: 'NCRTC' }
];

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [projectCode, setProjectCode] = useState<string>('CP-2026-');
  const [projectName, setProjectName] = useState<string>('');
  const [ministryId, setMinistryId] = useState<number>(1);
  const [sectorId, setSectorId] = useState<number>(1);
  const [agencyId, setAgencyId] = useState<number>(1);
  const [stateId, setStateId] = useState<number>(1);
  const [approvedCost, setApprovedCost] = useState<string>('1250.00');
  const [approvedDate, setApprovedDate] = useState<string>('2024-01-15');
  const [plannedStartDate, setPlannedStartDate] = useState<string>('2024-03-01');
  const [plannedCompletionDate, setPlannedCompletionDate] = useState<string>('2028-12-31');
  const [currentStatus, setCurrentStatus] = useState<string>('ONGOING');
  const [projectStage, setProjectStage] = useState<string>('Implementation');
  const [description, setDescription] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(19.7515);
  const [longitude, setLongitude] = useState<number>(75.7139);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStateChange = (newStatId: number) => {
    setStateId(newStatId);
    const selectedState = STATES.find((s) => s.id === newStatId);
    if (selectedState) {
      setLatitude(selectedState.lat);
      setLongitude(selectedState.lng);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectCode.trim() || !projectName.trim() || !approvedCost) {
      showToast({
        type: 'critical',
        title: 'Validation Error',
        message: 'Please fill in Project Code, Project Name, and Sanctioned Cost.'
      });
      return;
    }

    const costNum = parseFloat(approvedCost);
    if (isNaN(costNum) || costNum <= 0) {
      showToast({
        type: 'critical',
        title: 'Invalid Cost',
        message: 'Sanctioned Cost must be a positive numeric value (₹ in Cr).'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateProjectPayload = {
        project_code: projectCode.trim().toUpperCase(),
        project_name: projectName.trim(),
        project_description: description.trim() || undefined,
        ministry_id: ministryId,
        sector_id: sectorId,
        agency_id: agencyId,
        state_id: stateId,
        approved_cost: costNum,
        original_cost: costNum,
        approved_date: approvedDate,
        planned_start_date: plannedStartDate,
        planned_completion_date: plannedCompletionDate,
        current_status: currentStatus,
        project_stage: projectStage,
        latitude: latitude,
        longitude: longitude,
        source_system: 'PAIMANA'
      };

      const created = await createProject(payload);

      showToast({
        type: 'success',
        title: 'Project Registered Successfully',
        message: `Project #${created.project_id} (${created.project_code}) is now stored in the database.`
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'critical',
        title: 'Creation Failed',
        message: err.message || 'Unable to store project in database. Please verify inputs.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Add New Infrastructure Project</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  MoSPI / IPMD ₹150+ Cr
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Register a new Central Sector project directly into the national monitoring database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
              <FileText className="w-4 h-4" /> 1. Project Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  placeholder="e.g. RAIL-2026-099"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Western Dedicated Freight Corridor Phase II"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Project Scope &amp; Executive Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of civil packages, alignment, target capacity, and strategic connectivity..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Section 2: Administrative Alignment */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
              <Building2 className="w-4 h-4" /> 2. Ministry, Sector &amp; Agency Alignment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Line Ministry</label>
                <select
                  value={ministryId}
                  onChange={(e) => setMinistryId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {MINISTRIES.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Infrastructure Sector</label>
                <select
                  value={sectorId}
                  onChange={(e) => setSectorId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Implementing Agency</label>
                <select
                  value={agencyId}
                  onChange={(e) => setAgencyId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {AGENCIES.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">State / UT Location</label>
                <select
                  value={stateId}
                  onChange={(e) => handleStateChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {STATES.map((st) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Outlay & Contractual Schedule */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
              <Coins className="w-4 h-4" /> 3. Sanction Outlay &amp; Timeline Targets
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sanctioned Cost (₹ Cr) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={approvedCost}
                  onChange={(e) => setApprovedCost(e.target.value)}
                  placeholder="e.g. 1500.00"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sanction Date</label>
                <input
                  type="date"
                  value={approvedDate}
                  onChange={(e) => setApprovedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Planned Start</label>
                <input
                  type="date"
                  value={plannedStartDate}
                  onChange={(e) => setPlannedStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Completion</label>
                <input
                  type="date"
                  value={plannedCompletionDate}
                  onChange={(e) => setPlannedCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Current Status</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="ONGOING">ONGOING (Standard Execution)</option>
                  <option value="DELAYED">DELAYED (Schedule Variance Lag)</option>
                  <option value="CRITICAL">CRITICAL (Requires Task-Force Intervention)</option>
                  <option value="COMPLETED">COMPLETED (Commissioned Asset)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Stage</label>
                <select
                  value={projectStage}
                  onChange={(e) => setProjectStage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="Implementation">Implementation</option>
                  <option value="Tendering">Tendering &amp; Award</option>
                  <option value="Pre-Construction">Pre-Construction (Land &amp; Clearances)</option>
                  <option value="Commissioning">Commissioning &amp; Trial Run</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Geospatial Map Pin Location */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
              <MapPin className="w-4 h-4" /> 4. Geospatial Map Pin Coordinates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Latitude (° N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Longitude (° E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Storing in Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save &amp; Store Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
