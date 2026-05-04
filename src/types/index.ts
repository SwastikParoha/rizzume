export interface Experience {
  company: string;
  title: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: Education[];
  coverLetter: string;
}
