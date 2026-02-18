import React, { useState } from 'react';
import InputForm from './components/InputForm';
import SlideCard from './components/SlideCard';
import axios from 'axios';
import { Download } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [slides, setSlides] = useState([]);
  const [metadata, setMetadata] = useState({ topic: '', tone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-content`, data);
      setSlides(response.data.slides);
      setMetadata({ topic: data.topic, tone: data.tone });
    } catch (err) {
      console.error(err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlide = (index, updatedSlide) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newSlides = [...slides];
      const temp = newSlides[index];
      newSlides[index] = newSlides[index - 1];
      newSlides[index - 1] = temp;
      setSlides(newSlides);
    }
  };

  const handleMoveDown = (index) => {
    if (index < slides.length - 1) {
      const newSlides = [...slides];
      const temp = newSlides[index];
      newSlides[index] = newSlides[index + 1];
      newSlides[index + 1] = temp;
      setSlides(newSlides);
    }
  };

  const handleRegenerateImage = async (index, prompt) => {
    try {
      // In a real app, we would show a loading state for just this image
      const response = await axios.post(`${API_BASE_URL}/generate-image`, null, {
        params: { prompt },
      });
      const newSlides = [...slides];
      newSlides[index].image_url = response.data.image_url;
      setSlides(newSlides);
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate image.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/export-pdf`, {
        slides,
        topic: metadata.topic,
        tone: metadata.tone
      }, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'carousel.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to export PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Vibe Coding Carousel
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Generate AI-powered carousel slides in seconds.
          </p>
        </div>

        <InputForm onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {slides.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Preview & Edit</h2>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                <Download size={20} />
                Export PDF
              </button>
            </div>

            <div className="space-y-4">
              {slides.map((slide, index) => (
                <SlideCard
                  key={index}
                  index={index}
                  slide={slide}
                  totalSlides={slides.length}
                  onUpdate={handleUpdateSlide}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onRegenerateImage={handleRegenerateImage}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
