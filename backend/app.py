from fastapi import FastAPI, File, UploadFile
import shutil
import os
import requests
from fastapi.staticfiles import StaticFiles
from model import predict

app = FastAPI()

# USDA API
USDA_API_KEY = "C0RpO2x7kUsAGNAwP7FK8BgJucMa9IdFg3OwDUjC"
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

def get_nutrition(food_name: str):
    clean_name = food_name.replace("_", " ").lower().strip()
    params = {"api_key": USDA_API_KEY, "query": clean_name, "pageSize": 1}
    response = requests.get(USDA_SEARCH_URL, params=params)
    if response.status_code != 200:
        return {"error": f"USDA error: {response.text}"}
    data = response.json()
    if "foods" not in data or len(data["foods"]) == 0:
        fallback = clean_name.split(" ")[0]
        params["query"] = fallback
        response = requests.get(USDA_SEARCH_URL, params=params)
        data = response.json()
        if "foods" not in data or len(data["foods"]) == 0:
            return {"error": "No nutrition info found."}

    food = data["foods"][0]
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
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    result = predict(temp_file_path)
    try:
        os.remove(temp_file_path)
    except:
        pass
    food_name_for_api = result["label"].replace("_", " ")
    nutrition = get_nutrition(food_name_for_api)
    return {"label": result["label"], "confidence": result["confidence"], "nutrition": nutrition}

# Serve frontend build at root
app.mount("/", StaticFiles(directory="static", html=True), name="frontend")