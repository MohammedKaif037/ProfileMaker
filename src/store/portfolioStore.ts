import { create } from 'zustand';
import { Portfolio, PortfolioSection, Template } from '../types/portfolio';

interface PortfolioState {
  portfolio: Portfolio | null;
  templates: Template[];
  setPortfolio: (portfolio: Portfolio) => void;
  updateSection: (sectionId: string, updates: Partial<PortfolioSection>) => void;
  reorderSections: (sections: PortfolioSection[]) => void;
  setTemplate: (templateId: string) => void;
  updateCustomStyles: (styles: Portfolio['customStyles']) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: {
    id: '1',
    title: 'My Portfolio',
    template: {
      id: 'minimal',
      name: 'Minimal',
      thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=300&q=80',
      styles: {
        primary: '#0f172a',
        secondary: '#64748b',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#1e293b'
      }
    },
    sections: [
      {
        id: '1',
        type: 'about',
        title: 'About Me',
        content: null,
        isOptional: false,
        order: 0
      },
      {
        id: '2',
        type: 'projects',
        title: 'Projects',
        content: null,
        isOptional: false,
        order: 1
      },
      {
        id: '3',
        type: 'skills',
        title: 'Skills',
        content: null,
        isOptional: false,
        order: 2
      }
    ]
  },
  templates: [],
  
  setPortfolio: (portfolio) => set({ portfolio }),
  
  updateSection: (sectionId, updates) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            sections: state.portfolio.sections.map((section) =>
              section.id === sectionId ? { ...section, ...updates } : section
            ),
          }
        : null,
    })),
  
  reorderSections: (sections) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            sections,
          }
        : null,
    })),
  
  setTemplate: (templateId) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            template: state.templates.find((t) => t.id === templateId) || state.portfolio.template,
          }
        : null,
    })),
  
  updateCustomStyles: (styles) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            customStyles: styles,
          }
        : null,
    })),
}));