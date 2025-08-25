import React, { useState } from 'react';
import axios from 'axios'; 
import { CameraCapture } from '../Camera/Camera';

export function Scanner() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null); // State for API response
    const [error, setError] = useState(null); // State for handling errors

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setScanResult(null); // Reset previous result
                setError(null); // Reset previous error
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (imageDataUrl) => {
        setSelectedImage(imageDataUrl);
        setScanResult(null); // Reset previous result
        setError(null); // Reset previous error
    };

   const handleScan = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setScanResult(null);
    setError(null);

    try {
        const apiEndpoint = import.meta.env.VITE_PLANT_API_ENDPOINT;

        if (!apiEndpoint) {
            throw new Error("API endpoint is not configured in .env.local file.");
        }

        
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        
      
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');

       
        const result = await axios.post(apiEndpoint, formData);

        console.log("API Response:", result.data);

        setScanResult(result.data); 

    } catch (err) {
        console.error("Error during scan:", err);
        const errorMessage = err.response?.data?.detail || err.message;
        setError(`Request failed: ${errorMessage}`);
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
                                Upload a photo or use your camera to capture a plant image.
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
                        className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? 'Analyzing...' : 'Scan for Diseases'}
                    </button>
                )}

                {/* Section to Display API Results or Errors */}
                <div className="mt-8">
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Error</h2>
                            <p>{error}</p>
                        </div>
                    )}

                       {scanResult && (
                        <div>
                            {/* Check if confidence is >= 90% (0.9) */}
                            {scanResult.confidence >= 0.90 ? (
                                <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold mb-4">Scan Results</h2>
                                    <p className="text-lg">
                                        <strong>Prediction:</strong> {scanResult.class || 'N/A'}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Confidence:</strong> {`${(scanResult.confidence * 100).toFixed(2)}%`}
                                    </p>
                                </div>
                            ) : (
                                // If confidence is less than 90%, show this message
                                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold mb-2">Invalid Image</h2>
                                    <p>The model's confidence is too low. Please try a clearer image.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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