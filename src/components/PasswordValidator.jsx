import React from 'react';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

export const validatePasswordCriteria = (password = '') => {
  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'One special symbol (e.g. @$!%*?&#^_-)', met: /[^A-Za-z0-9\s]/.test(password) },
  ];

  const metCount = criteria.filter(c => c.met).length;
  const isValid = metCount === criteria.length;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-red-500';
  let strengthPercent = (metCount / criteria.length) * 100;

  if (metCount >= 5) {
    strengthLabel = 'Strong & Secure';
    strengthColor = 'bg-emerald-500';
  } else if (metCount >= 4) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
  } else if (metCount >= 3) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
  } else if (metCount >= 1) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-orange-500';
  }

  return { criteria, metCount, isValid, strengthLabel, strengthColor, strengthPercent };
};

export default function PasswordValidator({ password = '', confirmPassword, showAlways = false }) {
  if (!password && !showAlways) return null;

  const { criteria, isValid, strengthLabel, strengthColor, strengthPercent } = validatePasswordCriteria(password);
  const passwordsMatch = confirmPassword !== undefined && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword !== undefined && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-3 transition-all duration-200">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            {isValid ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            )}
            <span>Password Strength:</span>
            <span className={`font-bold ${isValid ? 'text-emerald-600' : 'text-slate-600'}`}>
              {password ? strengthLabel : 'Not entered'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {criteria.filter(c => c.met).length}/{criteria.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${password ? strengthPercent : 0}%` }}
          />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-1.5 text-[11px] transition-colors ${
              item.met ? 'text-emerald-700 font-medium' : 'text-slate-500'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                item.met ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {item.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Match confirmation if confirmPassword is provided */}
      {confirmPassword !== undefined && (
        <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px]">
          {passwordsMatch && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Passwords match perfectly</span>
            </div>
          )}
          {passwordsMismatch && (
            <div className="flex items-center gap-1.5 text-red-600 font-medium">
              <div className="w-3.5 h-3.5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <X className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Passwords do not match yet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
