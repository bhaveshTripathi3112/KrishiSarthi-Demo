

import React, { useState } from 'react';
import { CameraCapture } from '../Camera/Camera';

export function Scanner() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (imageDataUrl) => {
        setSelectedImage(imageDataUrl);
    };

    const handleScan = async () => {
        if (!selectedImage) return;
        
        setLoading(true);
        try {
            // TODO: Implement your API call to ML model here
            // const response = await fetch('your-api-endpoint', {
            //     method: 'POST',
            //     body: JSON.stringify({ image: selectedImage }),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // const data = await response.json();
            // Handle the response
        } catch (error) {
            console.error("Error during scan:", error);
            alert("An error occurred during the scan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Plant Disease Scanner</h1>
            
            <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Selected plant"
                            className="max-w-full h-auto mx-auto rounded-lg"
                        />
                    ) : (
                        <div className="space-y-4">
                            <div className="text-6xl">🌿</div>
                            <p className="text-gray-600">
                                Upload a photo or use camera to capture plant image
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setShowCamera(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Use Camera
                    </button>
                    <label className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {selectedImage && (
                    <button
                        onClick={handleScan}
                        className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Analyzing...' : 'Scan for Diseases'}
                    </button>
                )}
            </div>

            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </div>
    );
}