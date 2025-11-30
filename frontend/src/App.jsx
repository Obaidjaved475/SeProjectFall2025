import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const res = await axios.post("http://localhost:8000/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setResult(res.data);
  };

  return (
    <div style={{padding: 20}}>
      <h1>Food Nutrition Finder</h1>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={upload}>Analyze</button>

      {result && (
        <div style={{marginTop: 20}}>
          <h3>Food: {result.food}</h3>
          <pre>{JSON.stringify(result.nutrition, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
