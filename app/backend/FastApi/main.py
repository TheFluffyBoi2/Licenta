import pandas as pd
import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from contextlib import asynccontextmanager
from recommender import get_description_recommendations, get_recommendations

DATA_PATH: str = 'working.csv'
EMBEDDINGS_PATH: str = 'embeddings.pkl'
TOP_GAMES_PATH: str = 'top_games.pkl'
MODEL_PATH: str = './mpnet_model'

app_data = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    app_data['df'] = pd.read_csv(DATA_PATH, usecols=['id', 'series', 'franchise', 'name', 'total_score', 'category'])

    with open(TOP_GAMES_PATH, 'rb') as f:
        app_data['top_games'] = pickle.load(f)

    with open(EMBEDDINGS_PATH, 'rb') as f:
        app_data['embeddings'] = pickle.load(f)

    app_data['model'] = SentenceTransformer(MODEL_PATH)

    yield
    app_data.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    description: str

class RecommendationResponse(BaseModel):
    id: int
    name: str
    score: float

@app.post("/recommendations", response_model=list[RecommendationResponse])
async def get_games_from_description(request: SearchRequest):
    try:
        return get_description_recommendations(request.description, app_data['df'], app_data['model'], app_data['embeddings'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/game/{game_id}", response_model=list[RecommendationResponse])
async def get_games_from_id(game_id: int):
    try:
        return get_recommendations(game_id, app_data['df'], app_data['top_games'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/user/{user_id}")
async def get_games_from_user(user_id: int):
    pass


