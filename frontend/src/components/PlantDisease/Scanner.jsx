// filepath: /Users/parasmehta/Desktop/KrishiSarthi/KrishiSarthi-Demo/frontend/src/components/PlantDisease/Scanner.jsx
import React, { useState } from 'react'

export  function Scanner() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        // TODO: Add image processing logic here
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Plant Disease Scanner</h1>
            
            <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer block"
                    >
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Selected plant"
                                className="max-w-full h-auto mx-auto rounded-lg"
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="text-6xl">📸</div>
                                <p className="text-gray-600">
                                    Click or drag to upload a photo of your plant
                                </p>
                            </div>
                        )}
                    </label>
                </div>

                {selectedImage && (
                    <button
                        className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                        onClick={() => {/* TODO: Add scan logic */}}
                    >
                        {loading ? 'Analyzing...' : 'Scan for Diseases'}
                    </button>
                )}
            </div>
        </div>
    );
}