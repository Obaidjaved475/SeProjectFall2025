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

      const res = await axios.post("/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    <div className="app-wrapper">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-icon-wrapper">
              <ChefHat />
            </div>
            <div className="header-text">
              <h1 className="app-title">Food Nutrition Analyzer</h1>
              <p className="app-subtitle">
                Powered by AI • Instant nutritional insights
              </p>
            </div>
          </div>
        </header>

        <div className="main-grid">
          {/* Left Column - Upload & Preview */}
          <div className="left-column">
            {/* Upload Area */}
            <div 
              className={`upload-section ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!preview ? (
                <div className="upload-content">
                  <div className="upload-icon-wrapper">
                    <UploadIcon />
                  </div>
                  <h2 className="upload-title">Drop your food image here</h2>
                  <p className="upload-subtitle">or click to browse from your device</p>
                  
                  <label className="upload-button-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <div className="upload-button">
                      <UploadIcon />
                      Select Image
                    </div>
                  </label>
                  
                  <p className="file-hint">Supports JPG, PNG, WebP • Max 10MB</p>
                </div>
              ) : (
                <div className="preview-section">
                  <div className="preview-header">
                    <div className="preview-badge">
                      <CheckIcon />
                      <span>Image Ready</span>
                    </div>
                    <button 
                      className="change-image-btn"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                        setResult(null);
                        setError(null);
                      }}
                    >
                      Change Image
                    </button>
                  </div>
                  <div className="preview-image-container">
                    <img 
                      src={preview} 
                      alt="Food preview" 
                      className="preview-image"
                    />
                    <div className="preview-overlay">
                      <div className="preview-overlay-content">
                        <CheckIcon />
                        <span>Ready to analyze</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Button - Show below upload when preview exists */}
            {preview && (
              <button 
                onClick={analyze}
                disabled={loading}
                className={`analyze-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FlameIcon />
                    <span>Analyze Nutrition</span>
                  </>
                )}
              </button>
            )}

            {/* Error Display */}
            {error && (
              <div className="error-section">
                <div className="error-content">
                  <AlertIcon />
                  <div>
                    <h3 className="error-title">Something went wrong</h3>
                    <p className="error-message">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="right-column">
            {result ? (
              <div className="results-section">
                {/* Header */}
                <div className="results-header">
                  <div className="results-title-row">
                    <div>
                      <h2 className="results-main-title">Analysis Complete</h2>
                      <p className="results-subtitle">AI-powered food identification</p>
                    </div>
                    <div className="confidence-badge">
                      <div className="confidence-circle">
                        <svg className="confidence-ring" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" className="confidence-bg"/>
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            className="confidence-fill"
                            style={{
                              strokeDasharray: `${result.confidence * 283} 283`
                            }}
                          />
                        </svg>
                        <div className="confidence-value">
                          {(result.confidence * 100).toFixed(0)}%
                        </div>
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
                      <h3>{result.label.replace(/_/g, ' ')}</h3>
                      <p>Detected food item</p>
                    </div>
                  </div>
                </div>

                {/* Nutrition Info */}
                {result.nutrition && !result.nutrition.error ? (
                  <div className="nutrition-section">
                    <div className="nutrition-header">
                      <h3 className="nutrition-title">Nutritional Information</h3>
                      <span className="nutrition-badge">Per 100g</span>
                    </div>
                    
                    <div className="nutrition-grid">
                      {Object.entries(result.nutrition).slice(0, 12).map(([key, value]) => {
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
                              {typeof value === 'string' ? value : `${value.toFixed(1)}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="nutrition-note">
                      <div className="note-content">
                        <ScaleIcon />
                        <p className="note-text">
                          Values shown are approximate and based on standard 100g portions. 
                          Actual nutrition may vary based on preparation and serving size.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : result.nutrition && result.nutrition.error ? (
                  <div className="nutrition-error">
                    <AlertIcon />
                    <div>
                      <h4 className="nutrition-error-title">Nutrition Data Unavailable</h4>
                      <p className="nutrition-error-message">{result.nutrition.error}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-wrapper">
                  <FlameIcon />
                </div>
                <h3 className="empty-title">Ready to Analyze</h3>
                <p className="empty-text">
                  Upload a food image to discover its nutritional content instantly
                </p>
                <div className="empty-features">
                  <div className="feature-item">
                    <CheckIcon />
                    <span>AI-Powered Recognition</span>
                  </div>
                  <div className="feature-item">
                    <CheckIcon />
                    <span>Instant Results</span>
                  </div>
                  <div className="feature-item">
                    <CheckIcon />
                    <span>Detailed Nutrition Data</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-text">
              © 2024 Food Nutrition Analyzer • Powered by AI & USDA Database
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;