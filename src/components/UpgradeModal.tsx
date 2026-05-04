'use client';
import { X, Zap, Infinity, Shield, Star } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

const features = [
  { icon: Infinity, text: 'Unlimited CV & Cover Letter generations' },
  { icon: Zap, text: 'Priority AI processing — results in 5 seconds' },
  { icon: Shield, text: 'ATS compatibility score for every resume' },
  { icon: Star, text: 'Multiple premium resume templates' },
];

export default function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative glass-card max-w-md w-full p-8 fade-in-up text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mx-auto mb-5">
          <Zap className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          You&apos;ve Used Your Free Credits
        </h2>
        <p className="text-slate-400 text-sm mb-7">
          Upgrade to Rizzume Pro for unlimited AI-powered applications.
        </p>

        {/* Feature list */}
        <div className="space-y-3 mb-8 text-left">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
              <div className="shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              {text}
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mb-2">
          <div className="text-3xl font-black text-white mb-1">
            $9<span className="text-lg font-normal text-slate-400">/month</span>
          </div>
          <div className="text-xs text-slate-500 mb-4">Cancel anytime · No hidden fees</div>
        </div>

        <button className="generate-btn w-full py-3.5 rounded-full text-white font-bold text-sm mb-3">
          Upgrade to Pro — $9/month
        </button>
        <button
          onClick={onClose}
          className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
