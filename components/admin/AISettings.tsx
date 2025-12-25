'use client';

import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AISettings() {
  const [settings, setSettings] = useState({
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    maxTokens: 2048,
    ragEnabled: true,
    vectorSearchEnabled: true,
  });

  const handleSave = async () => {
    try {
      // Save to Firestore or localStorage
      localStorage.setItem('aiSettings', JSON.stringify(settings));
      toast.success('AI settings saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" />
        AI Settings
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            AI Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
          >
            <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
            <option value="llama-3.1-70b-versatile">Llama 3.1 70B Versatile</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Temperature: {settings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-600 mt-1">Lower = more focused, Higher = more creative</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Max Tokens: {settings.maxTokens}
          </label>
          <input
            type="number"
            min="512"
            max="4096"
            value={settings.maxTokens}
            onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ragEnabled"
            checked={settings.ragEnabled}
            onChange={(e) => setSettings({ ...settings, ragEnabled: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="ragEnabled" className="text-sm font-medium text-gray-900">
            Enable RAG (Retrieval-Augmented Generation)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="vectorSearchEnabled"
            checked={settings.vectorSearchEnabled}
            onChange={(e) => setSettings({ ...settings, vectorSearchEnabled: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="vectorSearchEnabled" className="text-sm font-medium text-gray-900">
            Enable Vector Search
          </label>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}

