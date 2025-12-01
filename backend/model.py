from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

# Load processor and model
processor = AutoImageProcessor.from_pretrained("Dricz/food-classifier-224")
model = AutoModelForImageClassification.from_pretrained("Dricz/food-classifier-224")

def predict(image_path: str):
    """
    Takes an image path, preprocesses it, and returns the predicted food class and score.
    """
    image = Image.open(image_path).convert("RGB")
    
    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")

    # Make prediction
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        pred_idx = probs.argmax().item()
        confidence = probs[0, pred_idx].item()
    
    # Get label
    label = model.config.id2label[pred_idx]

    return {"label": label, "confidence": float(confidence)}
