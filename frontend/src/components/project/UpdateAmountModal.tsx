import React, { useState, useEffect } from 'react';
import {
  X,
  Coins,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  History
} from 'lucide-react';
import { updateProject, UpdateProjectPayload } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../common/Toast';

interface UpdateAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: {
    project_id: number;
    project_code: string;
    project_name: string;
    approved_cost: number | string;
    revised_cost?: number | string | null;
    original_cost?: number | string | null;
  } | null;
}

export const UpdateAmountModal: React.FC<UpdateAmountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project
}) => {
  const { showToast } = useToast();

  const [approvedCost, setApprovedCost] = useState<string>('');
  const [revisedCost, setRevisedCost] = useState<string>('');
  const [hasRevisedCost, setHasRevisedCost] = useState<boolean>(false);
  const [revisionReason, setRevisionReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (project) {
      setApprovedCost(String(Number(project.approved_cost || 0)));
      if (project.revised_cost && Number(project.revised_cost) > 0) {
        setRevisedCost(String(Number(project.revised_cost)));
        setHasRevisedCost(true);
      } else {
        setRevisedCost('');
        setHasRevisedCost(false);
      }
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const currentApprovedNum = Number(approvedCost) || 0;
  const currentRevisedNum = hasRevisedCost ? Number(revisedCost) || 0 : 0;
  const costDrift = hasRevisedCost && currentRevisedNum > currentApprovedNum ? currentRevisedNum - currentApprovedNum : 0;
  const costDriftPct = currentApprovedNum > 0 && costDrift > 0 ? (costDrift / currentApprovedNum) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const appCostNum = parseFloat(approvedCost);
    if (isNaN(appCostNum) || appCostNum <= 0) {
      showToast({
        type: 'critical',
        title: 'Validation Error',
        message: 'Sanctioned Approved Cost must be a positive number.'
      });
      return;
    }

    let revCostNum: number | undefined = undefined;
    if (hasRevisedCost) {
      revCostNum = parseFloat(revisedCost);
      if (isNaN(revCostNum) || revCostNum <= 0) {
        showToast({
          type: 'critical',
          title: 'Validation Error',
          message: 'Revised Estimated Cost must be a positive number if enabled.'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: UpdateProjectPayload = {
        approved_cost: appCostNum,
        revised_cost: hasRevisedCost ? revCostNum : undefined
      };

      await updateProject(project.project_id, payload);

      showToast({
        type: 'success',
        title: 'Project Budget Updated',
        message: `Financial outlays for ${project.project_code} updated successfully in database.`
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'critical',
        title: 'Update Failed',
        message: err.message || 'Unable to update project financial amount.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Update Project Budget &amp; Outlay</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  #{project.project_id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono font-semibold truncate max-w-sm mt-0.5">
                {project.project_code} • {project.project_name}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {/* Approved Sanction Outlay */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Sanctioned Approved Cost (₹ in Cr) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={approvedCost}
                onChange={(e) => setApprovedCost(e.target.value)}
                placeholder="e.g. 1850.00"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                ₹ Cr
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Original / approved cabinet sanction baseline for this infrastructure project.
            </p>
          </div>

          {/* Toggle for Revised Cost */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Revised Estimated Cost</span>
                <span className="text-[11px] text-slate-500">Enable if budget revision or cost escalation has been approved</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRevisedCost}
                  onChange={(e) => setHasRevisedCost(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {hasRevisedCost && (
              <div className="space-y-2 pt-2 border-t border-slate-200/80 animate-fadeIn">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Revised Sanctioned Amount (₹ in Cr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={revisedCost}
                    onChange={(e) => setRevisedCost(e.target.value)}
                    placeholder="e.g. 2100.00"
                    required={hasRevisedCost}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    ₹ Cr
                  </span>
                </div>

                {costDrift > 0 && (
                  <div className="flex items-center justify-between text-xs bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-200 font-mono">
                    <span className="flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Cost Overrun Drift:
                    </span>
                    <span className="font-extrabold">
                      +{formatCurrency(costDrift)} (+{costDriftPct.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Revision Reason / Justification */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Revision Justification / Ministry Order Reference (Optional)
            </label>
            <input
              type="text"
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="e.g. CCEA Order No. 42/2026 for scope expansion in Package 3"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
                  <span>Updating Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Updated Amount</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

