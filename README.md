# 🚀 Rizzume

**The 2-Click AI ATS-Friendly Resume Generator.**

Rizzume is a minimalist, Gen-Z focused web application designed to eliminate the friction of tailoring your resume for every single job application. 

Instead of filling out 20 different forms, you simply drop in your messy, standard resume, drop in the target job description, and Rizzume's AI handles the rest. Within seconds, it generates a perfectly tailored, keyword-optimized, ATS-friendly PDF resume and cover letter.

---

## ✨ Features

- **2-Click UX:** No complex forms. Just two text boxes (Base Stats & Job Description).
- **AI-Powered Tailoring:** Uses the Google Gemini API to extract your relevant skills and rewrite bullet points to match the exact keywords the employer is looking for.
- **Instant PDF Export:** Generates clean, standard, ATS-readable PDFs entirely on the client side.
- **Privacy-First Freemium:** Uses browser `localStorage` to track your free generation credits. No database accounts required to try it out.
- **Dark Mode Aesthetic:** Built with a stunning dark-mode, glassmorphism UI using Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend API:** Next.js Serverless Routes
- **AI Engine:** Google Gemini SDK (`@google/genai`)
- **PDF Generation:** Client-side HTML-to-PDF (`html2pdf.js` / `react-to-print`)
- **Icons:** Lucide React

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- A free [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/rizzume.git
   cd rizzume
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Rename `.env.local.example` to `.env.local` (or create it) and add your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

---

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
Make sure to add your `GEMINI_API_KEY` to your Vercel Environment Variables before deploying!

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a Pull Request if you'd like to help improve Rizzume.
