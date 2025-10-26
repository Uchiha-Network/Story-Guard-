import Link from 'next/link';
import { Shield, Search, Lock, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Protect Your Creative Work with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                AI-Powered Detection
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-200 max-w-3xl mx-auto">
              StoryGuard scans the internet for unauthorized use of your images, 
              powered by blockchain proof and AI detection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold hover:bg-purple-100 transition flex items-center justify-center"
              >
                Register Your IP
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000 -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            How StoryGuard Protects You
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Blockchain Proof
              </h3>
              <p className="text-gray-600">
                Register your work on Story Protocol blockchain with immutable ownership records.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                AI Detection
              </h3>
              <p className="text-gray-600">
                Advanced perceptual hashing finds your images even when modified or cropped.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Auto Protection
              </h3>
              <p className="text-gray-600">
                Continuous monitoring scans platforms 24/7 and alerts you to violations instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Monetize Violations
              </h3>
              <p className="text-gray-600">
                Turn infringements into licensing opportunities and earn from your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">10,000+</div>
            <div className="text-purple-200">Images Protected</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">500+</div>
            <div className="text-purple-200">Violations Detected</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">$50K+</div>
            <div className="text-purple-200">Revenue Recovered</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Ready to Protect Your Work?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators using StoryGuard to safeguard their intellectual property.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}