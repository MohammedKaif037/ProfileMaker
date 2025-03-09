export type PortfolioSection = {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  isOptional: boolean;
  order: number;
};

export enum SectionType {
  ABOUT = 'about',
  PROJECTS = 'projects',
  SKILLS = 'skills',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  CERTIFICATIONS = 'certifications',
  CONTACT = 'contact',
  BLOG = 'blog',
  OPEN_SOURCE = 'openSource',
  TESTIMONIALS = 'testimonials',
  RESUME = 'resume',
  EXPERIENCE = 'experience',
  EDUCATION = 'education'
}

export type Template = {
  id: string;
  name: string;
  thumbnail: string;
  styles: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
};

export type Portfolio = {
  id: string;
  title: string;
  template: Template;
  sections: PortfolioSection[];
  customStyles?: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
};

export type AboutContent = {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
};

export type ProjectContent = {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
};

export type SkillContent = {
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
};

export type ExperienceContent = {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
};

export type EducationContent = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
};

export type CertificationContent = {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
};

export type ContactContent = {
  email: string;
  phone?: string;
  location?: string;
  preferredContact: string;
};

export type BlogContent = {
  posts: {
    title: string;
    excerpt: string;
    date: string;
    url: string;
  }[];
};

export type OpenSourceContent = {
  contributions: {
    project: string;
    description: string;
    url: string;
    type: string;
  }[];
};

export type TestimonialContent = {
  testimonials: {
    name: string;
    position: string;
    company: string;
    content: string;
    avatar?: string;
  }[];
};

export type ResumeContent = {
  fileUrl: string;
  lastUpdated: string;
};
