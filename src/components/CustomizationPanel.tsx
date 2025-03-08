import React from 'react';
import { X } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';

interface Props {
  onClose: () => void;
}

const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Open Sans', value: 'Open Sans' },
];

export const CustomizationPanel: React.FC<Props> = ({ onClose }) => {
  const portfolio = usePortfolioStore((state) => state.portfolio);
  const updateCustomStyles = usePortfolioStore((state) => state.updateCustomStyles);

  const handleColorChange = (key: string, value: string) => {
    if (!portfolio) return;

    const currentStyles = portfolio.customStyles || {
      colors: { ...portfolio.template.styles },
      fonts: { heading: 'Inter', body: 'Inter' },
    };

    updateCustomStyles({
      ...currentStyles,
      colors: {
        ...currentStyles.colors,
        [key]: value,
      },
    });
  };

  const handleFontChange = (key: 'heading' | 'body', value: string) => {
    if (!portfolio) return;

    const currentStyles = portfolio.customStyles || {
      colors: { ...portfolio.template.styles },
      fonts: { heading: 'Inter', body: 'Inter' },
    };

    updateCustomStyles({
      ...currentStyles,
      fonts: {
        ...currentStyles.fonts,
        [key]: value,
      },
    });
  };

  const styles = portfolio?.customStyles?.colors || portfolio?.template.styles;
  const fonts = portfolio?.customStyles?.fonts || { heading: 'Inter', body: 'Inter' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-md overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Customize Template</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Colors</h3>
            <div className="space-y-4">
              {Object.entries(styles || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="capitalize text-sm font-medium text-gray-700">
                    {key}
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: value }}
                    />
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-8 p-0 border-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Typography</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Font
                </label>
                <select
                  value={fonts.heading}
                  onChange={(e) => handleFontChange('heading', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body Font
                </label>
                <select
                  value={fonts.body}
                  onChange={(e) => handleFontChange('body', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={() => {
                updateCustomStyles(undefined);
                onClose();
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Reset to Template Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};