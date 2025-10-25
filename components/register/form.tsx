'use client';

import { Shield, Lock, Zap } from 'lucide-react';

interface RegistrationFormProps {
  formData: {
    creatorName: string;
    licenseType: string;
    description: string;
    tags: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function RegistrationForm({ formData, onChange }: RegistrationFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        IP Registration Details
      </h2>

      <form className="space-y-6">
        {/* Creator Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Creator Name / Brand *
          </label>
          <input
            type="text"
            value={formData.creatorName}
            onChange={(e) => onChange('creatorName', e.target.value)}
            placeholder="John Doe Photography"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* License Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default License Type *
          </label>
          <select
            value={formData.licenseType}
            onChange={(e) => onChange('licenseType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="All Rights Reserved">All Rights Reserved</option>
            <option value="Creative Commons BY">Creative Commons BY</option>
            <option value="Creative Commons BY-SA">Creative Commons BY-SA</option>
            <option value="Creative Commons BY-NC">Creative Commons BY-NC</option>
            <option value="Commercial License Available">Commercial License Available</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Description (Optional)
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe this collection of images..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => onChange('tags', e.target.value)}
            placeholder="photography, landscape, nature"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 mb-4">
            What You Get:
          </h3>
          
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Blockchain Proof</p>
              <p className="text-sm text-gray-600">
                Immutable timestamp and ownership record on Story Protocol
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">AI Detection</p>
              <p className="text-sm text-gray-600">
                Automatic perceptual hash generation for violation detection
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">IPFS Storage</p>
              <p className="text-sm text-gray-600">
                Decentralized storage with permanent content addressing
              </p>
            </div>
          </div>
        </div>

        {/* Cost Estimate */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Estimated Gas Fee:</span>
            <span className="font-semibold text-gray-800">~$0.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Registration Fee:</span>
            <span className="font-semibold text-gray-800">Free (Beta)</span>
          </div>
        </div>
      </form>
    </div>
  );
}
