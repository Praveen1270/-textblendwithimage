import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Upload, Image as ImageIcon, Type, Palette, Download, Move, Maximize2, BringToFront, Search, Loader2, Eraser, Copy, Trash2, ArrowRight, ArrowDown, Wand2, LogOut } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import WebFont from 'webfontloader';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FONTS = [
  'Roboto', 'Arial', 'Times New Roman', 'Georgia', 'Verdana',
  'Helvetica', 'Courier New', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
  'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Helvetica Neue',
  'Futura', 'Century Gothic', 'Calibri', 'Candara', 'Franklin Gothic',
  'Optima', 'Baskerville', 'Cambria', 'Constantia', 'Corbel',
  'Didot', 'Geneva', 'Goudy Old Style', 'Hoefler Text', 'Lucida Grande',
  'Monaco', 'Perpetua', 'Rockwell', 'Segoe UI', 'Tahoma',
  'Arial Black', 'Copperplate', 'Gill Sans', 'Lucida Sans', 'Myriad Pro',
  'Palatino Linotype', 'Symbol', 'Times', 'Univers', 'Westminster',
  'Arial Narrow', 'Book Antiqua', 'Lucida Console', 'MS Sans Serif', 'Wide Latin'
];

const BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 
  'lighten', 'color-dodge', 'color-burn', 'hard-light', 
  'soft-light', 'difference', 'exclusion'
];

interface TextConfig {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  letterSpacing: number;
  font: string;
  horizontalTilt: number;
  verticalTilt: number;
  blendMode: string;
}

export default function Editor() {
  const navigate = useNavigate();
  const { isPremium, signOut } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [texts, setTexts] = useState<TextConfig[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; ratio: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    WebFont.load({
      google: {
        families: FONTS
      }
    });
  }, []);

  const availableFonts = isPremium ? FONTS : FONTS.slice(0, 20);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // All other functions remain the same as in the original Editor component...

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TextBlendWithImage Editor</h1>
          <div className="flex items-center space-x-4">
            {!isPremium && (
              <div className="text-sm text-gray-600 bg-yellow-100 px-4 py-2 rounded-md">
                Free Account - Limited Features
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview Area */}
          <div className="space-y-4">
            <div 
              ref={previewRef}
              className="relative min-h-[400px] bg-gray-200 rounded-lg overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {image ? (
                <>
                  {texts.map(text => (
                    <div 
                      key={text.id}
                      className={`absolute cursor-move select-none ${selectedTextId === text.id ? 'ring-2 ring-blue-500' : ''}`}
                      style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        fontSize: `${text.fontSize}px`,
                        color: text.color,
                        opacity: text.opacity,
                        transform: `
                          rotate(${text.rotation}deg)
                          skew(${text.horizontalTilt}deg, ${text.verticalTilt}deg)
                        `,
                        letterSpacing: `${text.letterSpacing}px`,
                        fontFamily: text.font,
                        mixBlendMode: text.blendMode as any
                      }}
                      onMouseDown={(e) => handleMouseDown(e, text.id)}
                    >
                      {text.content}
                    </div>
                  ))}
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </>
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Upload an image to get started</p>
                </div>
              )}
            </div>
            
            {/* Image Information */}
            {imageDimensions && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Image Information</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Dimensions</p>
                    <p className="font-medium">{imageDimensions.width} × {imageDimensions.height}px</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Aspect Ratio</p>
                    <p className="font-medium">{imageDimensions.ratio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <label className="flex items-center justify-center w-full h-12 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Choose a file</span>
                </span>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>

            {/* Text Management */}
            <div className="flex space-x-2">
              <button
                onClick={createNewText}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Type className="w-5 h-5 mr-2" />
                Add Text
              </button>
              {selectedTextId && (
                <>
                  <button
                    onClick={() => duplicateText(selectedTextId)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => removeText(selectedTextId)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Remove
                  </button>
                </>
              )}
            </div>

            {selectedTextId && (
              <>
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4 inline mr-2" />
                    Text Content
                  </label>
                  <input
                    type="text"
                    value={texts.find(t => t.id === selectedTextId)?.content}
                    onChange={(e) => updateText(selectedTextId, { content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Font Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family {!isPremium && <span className="text-xs text-gray-500">(20 of {FONTS.length} available)</span>}
                  </label>
                  <select
                    value={texts.find(t => t.id === selectedTextId)?.font}
                    onChange={(e) => updateText(selectedTextId, { font: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blend Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Wand2 className="w-4 h-4 inline mr-2" />
                    Blend Mode
                  </label>
                  <select
                    value={texts.find(t => t.id === selectedTextId)?.blendMode}
                    onChange={(e) => updateText(selectedTextId, { blendMode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BLEND_MODES.map(mode => (
                      <option key={mode} value={mode}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Maximize2 className="w-4 h-4 inline mr-2" />
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    value={texts.find(t => t.id === selectedTextId)?.fontSize}
                    onChange={(e) => updateText(selectedTextId, { fontSize: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Letter Spacing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Spacing
                  </label>
                  <input
                    type="range"
                    min="-10"
                    max="50"
                    value={texts.find(t => t.id === selectedTextId)?.letterSpacing}
                    onChange={(e) => updateText(selectedTextId, { letterSpacing: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotation
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={texts.find(t => t.id === selectedTextId)?.rotation}
                    onChange={(e) => updateText(selectedTextId, { rotation: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Horizontal Tilt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ArrowRight className="w-4 h-4 inline mr-2" />
                    Horizontal Tilt
                  </label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={texts.find(t => t.id === selectedTextId)?.horizontalTilt}
                    onChange={(e) => updateText(selectedTextId, { horizontalTilt: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Vertical Tilt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ArrowDown className="w-4 h-4 inline mr-2" />
                    Vertical Tilt
                  </label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={texts.find(t => t.id === selectedTextId)?.verticalTilt}
                    onChange={(e) => updateText(selectedTextId, { verticalTilt: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Opacity Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Eraser className="w-4 h-4 inline mr-2" />
                    Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={texts.find(t => t.id === selectedTextId)?.opacity}
                    onChange={(e) => updateText(selectedTextId, { opacity: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Color Picker */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Text Color
                  </label>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full h-10 rounded-md border border-gray-300"
                    style={{ backgroundColor: texts.find(t => t.id === selectedTextId)?.color }}
                  />
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <HexColorPicker
                        color={texts.find(t => t.id === selectedTextId)?.color}
                        onChange={(color) => updateText(selectedTextId, { color })}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!image}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Image
            </button>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}