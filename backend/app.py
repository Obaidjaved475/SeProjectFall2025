from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import requests
from model import predict
import os

app = FastAPI()

# Allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# USDA API configuration
# Read the API key from environment variables (fallback to the existing key).
# In production, set the `USDA_API_KEY` environment variable instead of relying
# on the fallback value.
import requests

USDA_API_KEY = "C0RpO2x7kUsAGNAwP7FK8BgJucMa9IdFg3OwDUjC"
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

def get_nutrition(food_name: str):
    """
    Calls USDA FoodData Central API and returns basic nutrition info.
    """

    # Clean up model output
    clean_name = food_name.replace("_", " ").lower().strip()

    params = {
        "api_key": USDA_API_KEY,
        "query": clean_name,
        "pageSize": 1,
    }

    response = requests.get(USDA_SEARCH_URL, params=params)

    # If USDA rejects the request, show real message
    if response.status_code != 200:
        return {"error": f"USDA error: {response.text}"}

    data = response.json()

    if "foods" not in data or len(data["foods"]) == 0:
        # Try fallback query with only the first word (e.g., strawberry)
        fallback = clean_name.split(" ")[0]
        params["query"] = fallback
        response = requests.get(USDA_SEARCH_URL, params=params)
        data = response.json()

        if "foods" not in data or len(data["foods"]) == 0:
            return {"error": "No nutrition info found."}

    food = data["foods"][0]

    # Handle both types of nutrient fields
    raw_nutrients = food.get("foodNutrients") or food.get("nutrients") or []

    nutrients = {}
    for n in raw_nutrients:
        name = n.get("nutrientName") or n.get("name")
        value = n.get("value")
        unit = n.get("unitName") or n.get("unit")

        if name and value is not None:
            nutrients[name] = f"{value} {unit}"

    return nutrients


@app.post("/predict/")
async def predict_food(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Predict
    result = predict(temp_file_path)

    # Remove temp file
    try:
        os.remove(temp_file_path)
    except:
        pass

    # --- FIX APPLIED HERE ---
    # Replace underscores with spaces so USDA API can find the food
    # e.g., "french_fries" becomes "french fries"
    food_name_for_api = result["label"].replace("_", " ")
    nutrition = get_nutrition(food_name_for_api)

    return {
        "label": result["label"],
        "confidence": result["confidence"],
        "nutrition": nutrition
    }

@app.get("/")
def root():
    return {"message": "Food classifier + nutrition API running."}