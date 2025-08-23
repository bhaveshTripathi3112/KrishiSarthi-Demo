import React from 'react'
import homeImage from '/src/assets/hero-image.jpeg' // Ensure you have an appropriate image in the assets folder
import { Link } from 'react-router-dom';

export  function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-4 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                                कृषिSarthi: Your Plant Disease Detection Assistant
                            </h1>
                            <p className="text-xl text-gray-600">
                                Upload a photo of your plant's leaf and get instant disease detection results with prevention measures.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    to="/scanner"
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                                >
                                    Start Scanning
                                </Link>
                                <Link
                                    to="/about"
                                    className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-300"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src={homeImage} 
                                alt="Farmer using KrishiSarthi app" 
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How KrishiSarthi Helps You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            title="Quick Disease Detection"
                            description="Get instant results about plant diseases using our AI-powered system"
                            icon="🔍"
                        />
                        <FeatureCard 
                            title="Prevention Measures"
                            description="Receive detailed prevention and treatment recommendations"
                            icon="💊"
                        />
                        <FeatureCard 
                            title="Expert Support"
                            description="Connect with agricultural experts for additional guidance"
                            icon="👨‍🌾"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-green-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to protect your crops?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of farmers using KrishiSarthi to keep their plants healthy
                    </p>
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Get Started For Free
                    </Link>
                </div>
            </section>
        </div>
    );
}

// Feature Card Component
function FeatureCard({ title, description, icon }) {
    return (
        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-300">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}