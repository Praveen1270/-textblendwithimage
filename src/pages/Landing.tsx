import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ImageIcon, Star, Lock } from 'lucide-react';

const EXAMPLE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    text: 'NATURE',
    description: 'Text behind mountain peaks'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    text: 'SUNSET',
    description: 'Text blending with sunset colors'
  },
  {
    url: 'https://images.unsplash.com/photo-1520962922320-2038eebab146',
    text: 'URBAN',
    description: 'Text integrated with city architecture'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            TextBlendWithImage
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create stunning text-behind-object designs with our AI-powered tools
          </p>
          {user ? (
            <button
              onClick={() => navigate('/editor')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Editor
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign in with Google to Start
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {EXAMPLE_IMAGES.map((example, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img
                  src={example.url}
                  alt={example.description}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-4xl font-bold text-white mix-blend-overlay">
                    {example.text}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{example.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Free Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                Basic image editing tools
              </li>
              <li className="flex items-center text-gray-600">
                <Star className="w-5 h-5 mr-2 text-blue-500" />
                20 premium fonts
              </li>
              <li className="flex items-center text-gray-600">
                <Lock className="w-5 h-5 mr-2 text-blue-500" />
                Standard blend modes
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Premium Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Access to 200+ premium fonts
              </li>
              <li className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Advanced editing tools
              </li>
              <li className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                All blend modes and effects
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}