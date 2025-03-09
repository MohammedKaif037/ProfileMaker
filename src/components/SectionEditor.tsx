import React from 'react';
import { PortfolioSection, SectionType } from '../types/portfolio';
import { usePortfolioStore } from '../store/portfolioStore';
import { X } from 'lucide-react';

interface Props {
  section: PortfolioSection;
  onClose: () => void;
}

export const SectionEditor: React.FC<Props> = ({ section, onClose }) => {
  const updateSection = usePortfolioStore((state) => state.updateSection);

  const handleContentChange = (content: any) => {
    updateSection(section.id, { content });
  };

  const renderEditor = () => {
    switch (section.type) {
      case SectionType.ABOUT:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={section.content?.name || ''}
                onChange={(e) => handleContentChange({ ...section.content, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={section.content?.title || ''}
                onChange={(e) => handleContentChange({ ...section.content, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={section.content?.bio || ''}
                onChange={(e) => handleContentChange({ ...section.content, bio: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        );
      // Add more section type editors here
            case SectionType.EXPERIENCE:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              value={section.content?.position || ''}
              onChange={(e) => handleContentChange({ ...section.content, position: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={section.content?.company || ''}
              onChange={(e) => handleContentChange({ ...section.content, company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {/* Add more experience fields */}
        </div>
      );

    case SectionType.EDUCATION:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Institution</label>
            <input
              type="text"
              value={section.content?.institution || ''}
              onChange={(e) => handleContentChange({ ...section.content, institution: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              value={section.content?.degree || ''}
              onChange={(e) => handleContentChange({ ...section.content, degree: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {/* Add more education fields */}
        </div>
      );
      default:
        return <div>Editor not implemented for this section type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {renderEditor()}
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
