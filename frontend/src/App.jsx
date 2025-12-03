import { useState } from "react";
import axios from "axios";
import "./App.css";
import ChefHat from "./SVG/ChefHat";
import UploadIcon from "./SVG/UploadIcon";
import CheckIcon from "./SVG/CheckIcon";
import FlameIcon from "./SVG/FlameIcon";
import AlertIcon from "./SVG/AlertIcon";
import AppleIcon from "./SVG/AppleIcon";
import NutritionIcon from "./SVG/NutritionIcon";
import ScaleIcon from "./SVG/ScaleIcon";



function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const analyze = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await axios.post("http://localhost:8000/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getNutritionIcon = (key) => {
    const normalizedKey = key.toLowerCase();
    if (normalizedKey.includes("calori")) return 'calories';
    if (normalizedKey.includes("protein")) return 'protein';
    if (normalizedKey.includes("carb")) return 'carbohydrates';
    if (normalizedKey.includes("fat")) return 'fat';
    return null;
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <ChefHat />
          <h1 className="app-title">Food Nutrition Analyzer</h1>
        </div>
        <p className="app-subtitle">
          Upload a photo of your food and discover its nutritional content instantly
        </p>
      </header>

      <div className="main-grid">
        {/* Left Column - Upload & Preview */}
        <div>
          {/* Upload Area */}
          <div 
            className={`upload-section ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <div className="upload-icon-wrapper">
                <UploadIcon />
              </div>
              <h2 className="upload-title">Upload Food Image</h2>
              <p className="upload-subtitle">Drag & drop or click to browse</p>
              
              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="upload-button">
                  <UploadIcon />
                  Choose Image
                </div>
              </label>
              
              <p className="file-hint">Supports JPG, PNG, WebP up to 10MB</p>
            </div>
          </div>

          {/* Preview Area */}
          {preview && (
            <div className="preview-section">
              <h3 className="preview-header">
                <CheckIcon />
                Image Preview
              </h3>
              <div className="preview-image-container">
                <img 
                  src={preview} 
                  alt="Food preview" 
                  className="preview-image"
                />
                <div className="preview-overlay">
                  <p>Ready to analyze</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div>
          {/* Analyze Button */}
          <div className="analyze-section">
            <button 
              onClick={analyze}
              disabled={loading || !image}
              className="analyze-button"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Analyzing Your Food...
                </>
              ) : (
                <>
                  <FlameIcon />
                  Analyze Nutrition
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-section">
              <div className="error-content">
                <AlertIcon />
                <div>
                  <h3 className="error-title">Error</h3>
                  <p className="error-message">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result ? (
            <div className="results-section">
              {/* Header */}
              <div className="results-header">
                <div className="results-title-row">
                  <div>
                    <h2 className="results-main-title">Analysis Complete</h2>
                    <p className="results-subtitle">Food successfully identified</p>
                  </div>
                  <div className="confidence-badge">
                    <div className="confidence-value">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="confidence-label">Confidence</div>
                  </div>
                </div>
              </div>

              {/* Food Info */}
              <div className="food-info">
                <div className="food-info-content">
                  <div className="food-icon-wrapper">
                    <AppleIcon />
                  </div>
                  <div className="food-details">
                    <h3>{result.label}</h3>
                    <p>Food detected</p>
                  </div>
                </div>
              </div>

              {/* Nutrition Info */}
              {result.nutrition && !result.nutrition.error ? (
                <div className="nutrition-section">
                  <div className="nutrition-header">
                    <h3 className="nutrition-title">Nutritional Values</h3>
                    <span className="nutrition-badge">Per 100g serving</span>
                  </div>
                  
                  <div className="nutrition-grid">
                    {Object.entries(result.nutrition).map(([key, value]) => {
                      const iconType = getNutritionIcon(key);
                      return (
                        <div key={key} className="nutrition-card">
                          <div className="nutrition-card-header">
                            {iconType && <NutritionIcon type={iconType} />}
                            <div className="nutrition-label">
                              {key.replace(/_/g, ' ')}
                            </div>
                          </div>
                          <div className="nutrition-value">
                            {typeof value === 'number' ? value.toFixed(1) : value}
                          </div>
                          <div className="nutrition-unit">
                            {key.toLowerCase().includes('calori') ? 'kcal' : 'grams'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Note about 100g */}
                  <div className="nutrition-note">
                    <div className="note-content">
                      <ScaleIcon />
                      <p className="note-text">
                        <strong>Note:</strong> All nutritional values shown are for a 100-gram serving of the detected food. 
                        Adjust based on your actual portion size.
                      </p>
                    </div>
                  </div>
                </div>
              ) : result.nutrition && result.nutrition.error ? (
                <div className="nutrition-error">
                  <div className="nutrition-error-content">
                    <div className="error-content-wrapper">
                      <AlertIcon />
                      <div>
                        <h4 className="nutrition-error-title">Nutrition Data Unavailable</h4>
                        <p className="nutrition-error-message">{result.nutrition.error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : !error ? (
            /* Empty State */
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <FlameIcon />
              </div>
              <h3 className="empty-title">Ready to Analyze</h3>
              <p className="empty-text">
                Upload a food image and click "Analyze Nutrition" to see detailed nutritional information
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p className="footer-text">
          Food Nutrition Analyzer • Uses AI to identify food and provide nutritional data
        </p>
        <p className="footer-note">
          Nutritional values are based on standard 100g portions
        </p>
      </footer>
    </div>
  );
}

export default App;