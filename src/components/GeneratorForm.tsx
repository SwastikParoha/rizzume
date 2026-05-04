'use client';
import { FileText, Target, Sparkles, AlertCircle } from 'lucide-react';

interface GeneratorFormProps {
  resumeText: string;
  setResumeText: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  onGenerate: () => void;
  error: string;
  credits: number;
  isLoaded: boolean;
}

export default function GeneratorForm({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  onGenerate,
  error,
  credits,
  isLoaded,
}: GeneratorFormProps) {
  const canGenerate = resumeText.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-4 fade-in-up">
      {/* Hero tagline */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
          Drop Your Resume.{' '}
          <span className="gradient-text">Get The Job.</span>
        </h1>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
          AI rewrites your CV to be ATS-perfect for every role — in seconds.
        </p>
      </div>

      {/* Two input cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Card 1 — Resume */}
        <div className="glass-card-purple p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-purple-400 font-mono text-xs font-bold tracking-widest">01.</span>
            <h2 className="text-white font-bold uppercase tracking-wider text-xs">Your Base Stats</h2>
            <FileText className="ml-auto text-purple-400/60 w-4 h-4" />
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder={`Paste your current resume, experiences, or raw data here...

Name, contact info, work history, skills — just dump it all in.`}
            className="w-full flex-1 min-h-[300px] bg-black/40 text-slate-200 text-sm placeholder:text-slate-600 resize-none rounded-xl p-4 textarea-glow border border-white/5 transition-all font-mono leading-relaxed"
          />
        </div>

        {/* Card 2 — Job Description */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-indigo-400 font-mono text-xs font-bold tracking-widest">02.</span>
            <h2 className="text-white font-bold uppercase tracking-wider text-xs">Job Description</h2>
            <Target className="ml-auto text-indigo-400/60 w-4 h-4" />
          </div>
          <p className="text-slate-500 text-xs -mt-2">Target Role</p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={`Paste the job description you're targeting here...

Include the full posting — responsibilities, requirements, preferred skills.`}
            className="w-full flex-1 min-h-[300px] bg-black/40 text-slate-200 text-sm placeholder:text-slate-600 resize-none rounded-xl p-4 textarea-glow-indigo border border-white/5 transition-all font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 max-w-2xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Generate button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || (isLoaded && credits <= 0)}
          className="generate-btn px-12 sm:px-20 py-4 sm:py-5 rounded-full text-white font-black text-base sm:text-lg flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          GENERATE RIZZUME ✨
        </button>

        {isLoaded && (
          <p className="text-slate-500 text-sm">
            {credits > 0
              ? `${credits} free generation${credits !== 1 ? 's' : ''} remaining`
              : 'No free credits — upgrade to continue'}
          </p>
        )}
      </div>
    </section>
  );
}
