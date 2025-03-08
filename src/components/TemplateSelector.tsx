import React from 'react';
import { Template } from '../types/portfolio';
import { usePortfolioStore } from '../store/portfolioStore';
import { Check } from 'lucide-react';

const templates: Template[] = [
  {
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
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    styles: {
      primary: '#18181b',
      secondary: '#71717a',
      accent: '#8b5cf6',
      background: '#fafafa',
      text: '#27272a'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=300&q=80',
    styles: {
      primary: '#1e1b4b',
      secondary: '#6366f1',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#312e81'
    }
  }
];

export const TemplateSelector: React.FC = () => {
  const { portfolio, setTemplate } = usePortfolioStore();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
            portfolio?.template.id === template.id
              ? 'ring-2 ring-indigo-500 scale-[1.02]'
              : 'hover:scale-[1.02]'
          }`}
          onClick={() => setTemplate(template.id)}
        >
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-semibold">{template.name}</h3>
          </div>
          {portfolio?.template.id === template.id && (
            <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};