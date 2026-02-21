import React, { useState } from 'react';
import { agentUseCases } from '../data/agentUseCases';

const InputForm = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState('');

  // Get unique categories
  const categories = [...new Set(agentUseCases.map(uc => uc.category))];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedUseCase('');
  };

  const handleUseCaseChange = (e) => {
    const useCaseId = parseInt(e.target.value);
    setSelectedUseCase(useCaseId);
    const useCase = agentUseCases.find(uc => uc.id === useCaseId);
    if (useCase) {
      setTopic(useCase.prompt);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic && tone) {
      onGenerate({ topic, tone, slide_count: parseInt(slideCount) });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Generate Carousel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category (Optional)</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            disabled={loading}
          >
            <option value="">Select a Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <label htmlFor="useCase" className="block text-sm font-medium text-gray-700">Agentic Use Case</label>
            <select
              id="useCase"
              value={selectedUseCase}
              onChange={handleUseCaseChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              disabled={loading}
            >
              <option value="">Select a Use Case</option>
              {agentUseCases
                .filter(uc => uc.category === selectedCategory)
                .map((uc) => (
                  <option key={uc.id} value={uc.id}>{uc.title}</option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic / Prompt</label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g., The Future of AI"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Tone</label>
          <input
            id="tone"
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g., Professional, Humorous"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="slideCount" className="block text-sm font-medium text-gray-700">Slide Count</label>
          <input
            id="slideCount"
            type="number"
            min="1"
            max="10"
            value={slideCount}
            onChange={(e) => setSlideCount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Generating...' : 'Generate Carousel'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
