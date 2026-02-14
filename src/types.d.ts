// Type definitions for resume.yaml imports
declare module '*.yaml' {
  export interface PersonalInfo {
    name: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
  }

  export interface Degree {
    degree: string;
    start: number;
    end: number;
    gpa?: string;
    details?: string[];
  }

  export interface School {
    institution: string;
    location: string;
    degrees: Degree[];
    awards?: string[];
  }

  export interface Bullet {
    id: string;
    text: string;
    importance: number;
    tags: string[];
  }

  export interface Experience {
    id: string;
    company: string;
    role: string;
    location: string;
    start: number;
    end: string | number;
    tags: string[];
    bullets: Bullet[];
  }

  export interface Publication {
    id: string;
    title: string;
    journal: string;
    year: number;
    authors: string[];
  }

  export interface Leadership {
    id: string;
    title: string;
    dates: string;
    bullets: string[];
  }

  export interface Skill {
    category: string;
    items: string[];
  }

  export interface ResumeData {
    personal: PersonalInfo;
    education: School[];
    experiences: Experience[];
    publications: Publication[];
    leadership: Leadership[];
    skills: Skill[];
  }

  const data: ResumeData;
  export default data;
}
