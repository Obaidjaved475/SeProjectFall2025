import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image); // FastAPI expects 'file'

      const res = await axios.post("http://localhost:8000/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Food Nutrition Finder</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImage(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {preview && (
        <div style={{ marginTop: 10 }}>
          <img 
            src={preview} 
            alt="preview" 
            style={{ width: 200, borderRadius: 8 }} 
          />
        </div>
      )}

      <button 
        onClick={analyze}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        {loading ? "Processing..." : "Analyze"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Food Detected: {result.label}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>

          {result.nutrition && !result.nutrition.error && (
            <div style={{ marginTop: 10 }}>
              <h4>Nutrition Info:</h4>
              <ul>
                {Object.entries(result.nutrition).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.nutrition && result.nutrition.error && (
            <p style={{ color: "orange" }}>Nutrition Info: {result.nutrition.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
