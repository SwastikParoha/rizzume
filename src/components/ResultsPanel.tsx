'use client';
import { useState, useCallback } from 'react';
import { Download, ArrowLeft, FileText, Mail, CheckCircle } from 'lucide-react';
import { ResumeData } from '@/types';
import ResumeTemplate from './ResumeTemplate';
import CoverLetterTemplate from './CoverLetterTemplate';

interface ResultsPanelProps {
  data: ResumeData;
  credits: number;
  onReset: () => void;
}

type Tab = 'resume' | 'cover';

export default function ResultsPanel({ data, credits, onReset }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('resume');
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadPDF = useCallback(async (elementId: string, filename: string) => {
    setDownloading(elementId);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById(elementId);
      if (!element) return;

      await html2pdf()
        .set({
          margin: 0,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    } finally {
      setDownloading(null);
    }
  }, []);

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16 pt-2 fade-in-up">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Generate Another
        </button>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">Rizzume Generated!</span>
          <span className="credit-badge ml-2">{credits} credit{credits !== 1 ? 's' : ''} left</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5 w-fit">
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'resume' ? 'tab-active' : 'tab-inactive'}`}
        >
          <FileText className="w-4 h-4" />
          Resume
        </button>
        <button
          onClick={() => setActiveTab('cover')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'cover' ? 'tab-active' : 'tab-inactive'}`}
        >
          <Mail className="w-4 h-4" />
          Cover Letter
        </button>
      </div>

      {/* Download button */}
      <div className="flex justify-end mb-4">
        {activeTab === 'resume' ? (
          <button
            onClick={() => downloadPDF('resume-pdf-export', `${data.name || 'resume'}_rizzume.pdf`)}
            disabled={downloading === 'resume-pdf-export'}
            className="download-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading === 'resume-pdf-export' ? 'Generating PDF...' : 'Download Resume PDF'}
          </button>
        ) : (
          <button
            onClick={() => downloadPDF('cover-letter-pdf-export', `${data.name || 'cover'}_cover_letter.pdf`)}
            disabled={downloading === 'cover-letter-pdf-export'}
            className="download-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading === 'cover-letter-pdf-export' ? 'Generating PDF...' : 'Download Cover Letter PDF'}
          </button>
        )}
      </div>

      {/* Visible preview (scrollable, white paper look) */}
      <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <div className="overflow-y-auto max-h-[70vh]">
          {activeTab === 'resume' ? (
            <ResumeTemplate data={data} id="resume-preview" />
          ) : (
            <CoverLetterTemplate text={data.coverLetter} name={data.name} id="cover-preview" />
          )}
        </div>
      </div>

      {/* Off-screen full-height clones — these are what html2pdf actually renders */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '780px', pointerEvents: 'none', zIndex: -1 }}
      >
        <ResumeTemplate data={data} id="resume-pdf-export" />
        <CoverLetterTemplate text={data.coverLetter} name={data.name} id="cover-letter-pdf-export" />
      </div>
    </section>
  );
}
