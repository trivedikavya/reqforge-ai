import React from 'react'
import { Check } from 'lucide-react'

const templates = [
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    description: 'Perfect for complex enterprise projects',
    sections: 19,
    time: '15-20 min'
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Great for mid-size projects',
    sections: 10,
    time: '8-12 min'
  },
  {
    id: 'agile',
    name: 'Agile Quick-Start',
    description: 'Ideal for startups and MVPs',
    sections: 8,
    time: '5-8 min'
  }
]

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedTemplate === template.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {selectedTemplate === template.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{template.sections} sections</span>
            <span>⏱️ {template.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}