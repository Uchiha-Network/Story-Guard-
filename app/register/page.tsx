'use client';

import { useState } from 'react';
import { Shield, Info, CheckCircle, AlertCircle } from 'lucide-react';
import ImageUpload from '@/components/register/imguploads';
import RegistrationForm from '@/components/register/form';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: string;
  hash?: string;
}

export default function RegisterPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState({
    creatorName: '',
    licenseType: 'All Rights Reserved',
    description: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSimpleHash = (fileName: string): string => {
    // Simple hash based on filename and timestamp
    const str = fileName + Date.now();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  };

  const handleRegister = async () => {
    // Validation
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!formData.creatorName.trim()) {
      setError('Please enter your creator name');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Register each image
      const registrations = [];

      for (const image of images) {
        const hash = generateSimpleHash(image.file.name);
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageName: image.file.name,
            imageHash: hash,
            creatorName: formData.creatorName,
            licenseType: formData.licenseType,
            description: formData.description,
            tags: tags,
            fileSize: image.file.size,
            dimensions: { width: 0, height: 0 }, // Would get from actual image
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          registrations.push(data.data);
        } else {
          throw new Error(data.error || 'Failed to register image');
        }
      }

      // Success!
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setImages([]);
        setFormData({
          creatorName: '',
          licenseType: 'All Rights Reserved',
          description: '',
          tags: '',
        });
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to register images. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Register Your IP</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Protect your creative work with blockchain-verified ownership
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-900 font-semibold">
                Successfully registered {images.length} image{images.length !== 1 ? 's' : ''}!
              </p>
              <p className="text-sm text-green-800 mt-1">
                Your IP is now protected on the blockchain and being monitored for violations.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-900 font-semibold">Error</p>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900">
              <strong>How it works:</strong> Upload your images, add details, and we'll register them on 
              Story Protocol's blockchain. You'll get an immutable proof of ownership and automatic violation detection.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload (2/3 width) */}
          <div className="lg:col-span-2">
            <ImageUpload onImagesChange={setImages} />
            
            {/* Register Button */}
            {images.length > 0 && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setImages([])}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Clear All
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isSubmitting || !formData.creatorName}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Register {images.length} Image{images.length !== 1 ? 's' : ''} on Blockchain</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Form (1/3 width) */}
          <div className="lg:col-span-1">
            <RegistrationForm formData={formData} onChange={handleFormChange} />
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Registration Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Upload Images</h3>
              <p className="text-sm text-gray-600">
                Drag and drop or select your creative work
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Add Details</h3>
              <p className="text-sm text-gray-600">
                Fill in creator info and license terms
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Blockchain Registration</h3>
              <p className="text-sm text-gray-600">
                We mint your IP on Story Protocol
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Auto-Protection</h3>
              <p className="text-sm text-gray-600">
                Start monitoring for violations automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}