'use client';
import { useState } from 'react';
import { ResumeData } from '@/types';
import { useCredits } from '@/hooks/useCredits';
import MatrixBackground from '@/components/MatrixBackground';
import Navbar from '@/components/Navbar';
import GeneratorForm from '@/components/GeneratorForm';
import ResultsPanel from '@/components/ResultsPanel';
import UpgradeModal from '@/components/UpgradeModal';

type Step = 'input' | 'loading' | 'results';

function LoadingScreen() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] gap-6 fade-in-up">
      <div className="spinner" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-white">Generating your Rizzume...</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          The AI is tailoring your resume for ATS and writing your cover letter.
          <br />Takes about 10–15 seconds.
        </p>
      </div>
      {/* Animated steps */}
      <div className="flex flex-col gap-2 mt-4 text-xs text-slate-500">
        {['Analysing job description...', 'Extracting keywords...', 'Rewriting your experience...', 'Crafting cover letter...'].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>('input');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { credits, useCredit, isLoaded } = useCredits();

  const handleGenerate = async () => {
    if (isLoaded && credits <= 0) {
      setShowUpgrade(true);
      return;
    }

    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please fill in both fields before generating.');
      return;
    }

    // Consume credit before the API call
    const ok = useCredit();
    if (!ok) {
      setShowUpgrade(true);
      return;
    }

    setError('');
    setStep('loading');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Generation failed.');
      }

      setResumeData(json as ResumeData);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setResumeData(null);
    setError('');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Matrix rain background */}
      <MatrixBackground />

      {/* Ambient blobs */}
      <div
        className="blob-animate fixed top-[-120px] right-[-80px] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', zIndex: 1 }}
      />
      <div
        className="blob-animate fixed bottom-[-100px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', zIndex: 1, animationDelay: '3s' }}
      />

      {/* Navbar */}
      <Navbar credits={credits} isLoaded={isLoaded} />

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        {step === 'input' && (
          <GeneratorForm
            resumeText={resumeText}
            setResumeText={setResumeText}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onGenerate={handleGenerate}
            error={error}
            credits={credits}
            isLoaded={isLoaded}
          />
        )}

        {step === 'loading' && <LoadingScreen />}

        {step === 'results' && resumeData && (
          <ResultsPanel
            data={resumeData}
            credits={credits}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Freemium paywall */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
