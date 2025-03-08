import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil } from 'lucide-react';
import { PortfolioSection } from '../types/portfolio';
import { SectionEditor } from './SectionEditor';

interface Props {
  section: PortfolioSection;
}

export const DraggableSection: React.FC<Props> = ({ section }) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Pencil className="w-5 h-5 text-gray-500" />
            </button>
            <button
              className="cursor-move p-2 hover:bg-gray-100 rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {section.content ? (
            <div>
              {section.type === 'about' && (
                <>
                  <p className="font-medium">{section.content.name}</p>
                  <p>{section.content.title}</p>
                </>
              )}
              {/* Add more section type previews here */}
            </div>
          ) : (
            <p className="italic">Click edit to add content</p>
          )}
        </div>
      </div>
      {isEditing && (
        <SectionEditor
          section={section}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};