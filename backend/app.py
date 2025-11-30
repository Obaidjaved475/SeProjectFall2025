import gradio as gr
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image

# Load pre-trained MobileNetV2 model
model = MobileNetV2(weights="imagenet")

# Dummy nutrition database (per 100g)
nutrition_data = {
    "apple": {"Calories": 52, "Protein": 0.3, "Carbs": 14, "Fat": 0.2},
    "banana": {"Calories": 89, "Protein": 1.1, "Carbs": 23, "Fat": 0.3},
    "pizza": {"Calories": 266, "Protein": 11, "Carbs": 33, "Fat": 10},
    "salad": {"Calories": 33, "Protein": 2, "Carbs": 6, "Fat": 0.4},
}

def analyze_food(img):
    # Preprocess image
    img = img.resize((224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    # Model prediction
    preds = model.predict(x)
    decoded = decode_predictions(preds, top=1)[0][0]  # (class, description, prob)
    food_item = decoded[1].lower()

    # Nutrition mapping
    if food_item in nutrition_data:
        return {
            "Food Item": food_item,
            "Nutrition per 100g": nutrition_data[food_item]
        }
    else:
        return {"Food Item": food_item, "Nutrition per 100g": "Not available in DB"}

# Gradio interface
demo = gr.Interface(
    fn=analyze_food,
    inputs=gr.Image(type="pil", label="Upload a food image"),
    outputs="json",
    title="🍎 Food Nutrition Analyzer",
    description="Upload an image of food to analyze and view its nutritional information per 100g."
)

if __name__ == "__main__":
    demo.launch()
