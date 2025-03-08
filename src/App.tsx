import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableSection } from './components/DraggableSection';
import { TemplateSelector } from './components/TemplateSelector';
import { CustomizationPanel } from './components/CustomizationPanel';
import { ExportModal } from './components/ExportModal';
import { usePortfolioStore } from './store/portfolioStore';
import { Palette, Layout, FileDown, X } from 'lucide-react';

function App() {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const portfolio = usePortfolioStore((state) => state.portfolio);
  const reorderSections = usePortfolioStore((state) => state.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && portfolio) {
      const oldIndex = portfolio.sections.findIndex((section) => section.id === active.id);
      const newIndex = portfolio.sections.findIndex((section) => section.id === over.id);

      reorderSections(arrayMove(portfolio.sections, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Generator</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCustomization(true)}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Palette className="w-5 h-5 mr-2" />
                Customize
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Layout className="w-5 h-5 mr-2" />
                Templates
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={portfolio?.sections || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {portfolio?.sections.map((section) => (
                <DraggableSection key={section.id} section={section} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>

      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Choose a Template</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <TemplateSelector />
            </div>
          </div>
        </div>
      )}

      {showCustomization && (
        <CustomizationPanel onClose={() => setShowCustomization(false)} />
      )}

      {showExport && (
        <ExportModal onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}

export default App;