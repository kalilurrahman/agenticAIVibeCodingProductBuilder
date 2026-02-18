import React from 'react';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

const SlideCard = ({ slide, index, totalSlides, onUpdate, onMoveUp, onMoveDown, onRegenerateImage }) => {
  const handleHeadlineChange = (e) => {
    onUpdate(index, { ...slide, headline: e.target.value });
  };

  const handleBodyChange = (e) => {
    onUpdate(index, { ...slide, body: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex flex-col md:flex-row gap-6 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className={`p-1 rounded hover:bg-gray-100 ${index === 0 ? 'text-gray-300' : 'text-gray-600'}`}
          title="Move Up"
        >
          <ArrowUp size={20} />
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={index === totalSlides - 1}
          className={`p-1 rounded hover:bg-gray-100 ${index === totalSlides - 1 ? 'text-gray-300' : 'text-gray-600'}`}
          title="Move Down"
        >
          <ArrowDown size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-4">
        <div>
            <label htmlFor={`headline-${index}`} className="block text-xs font-bold text-gray-500 uppercase">Headline</label>
            <input
                id={`headline-${index}`}
                type="text"
                value={slide.headline}
                onChange={handleHeadlineChange}
                className="w-full text-xl font-bold border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none py-1"
            />
        </div>
        <div>
            <label htmlFor={`body-${index}`} className="block text-xs font-bold text-gray-500 uppercase">Body</label>
            <textarea
                id={`body-${index}`}
                value={slide.body}
                onChange={handleBodyChange}
                rows={4}
                className="w-full text-gray-700 border rounded p-2 mt-1 hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
            />
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-2">
        <div className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {slide.image_url ? (
                <img src={slide.image_url} alt="Slide visual" className="w-full h-full object-cover" />
            ) : (
                <span className="text-gray-400">No Image</span>
            )}
            <button
                onClick={() => onRegenerateImage(index, slide.image_prompt)}
                className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-full shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Regenerate Image"
            >
                <RefreshCw size={16} />
            </button>
        </div>
        <div className="text-xs text-gray-500">
            Prompt: {slide.image_prompt}
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
