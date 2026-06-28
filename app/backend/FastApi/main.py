import pandas as pd
import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from contextlib import asynccontextmanager
from recommender import get_description_recommendations, get_recommendations, get_recommendations_from_user, umap_visualization
from typing import Any


DATA_PATH: str = 'working.csv'
EMBEDDINGS_DATA_PATH: str = 'data.pkl'
MODEL_PATH: str = './mpnet_model'

app_data = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    app_data['df'] = pd.read_csv(DATA_PATH, usecols=['id', 'series', 'franchise', 'name', 'total_score', 'category'])

    with open(EMBEDDINGS_DATA_PATH, 'rb') as f:
        data = pickle.load(f)
        app_data['embeddings'] = data["main"]
        app_data['top_games'] = data["top_sim_dict"]
        app_data['game_to_index'] = data["game_to_index"]
        app_data['index_to_game'] = data["index_to_game"]
        app_data['genres'] = data["genres"]
        app_data['themes'] = data["themes"]
        app_data['keywords'] = data["keywords"]
        app_data['summary'] = data["summary"]

    app_data['model'] = SentenceTransformer(MODEL_PATH)
    _ = app_data['model'].encode(
        "celeste, madeline, platformer, mechanics",
        convert_to_numpy=True,
        normalize_embeddings=True
    )

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

class UserGamesRequest(BaseModel):
    games_tuple: list[tuple[int, int]]

class UserGamesIds(BaseModel):
    game_ids: list[int]

class RecommendationResponse(BaseModel):
    id: int
    name: str
    recommendation_score: float
    explanation: dict[str, Any]

class UserRecommendationResponse(BaseModel):
    id: int
    name: str
    recommendation_score: float
    user_explanation: list[dict[str, Any]]

class UMAPPoint(BaseModel):
    game_id: int
    x: float
    y: float
    cluster: int

@app.post("/recommendations", response_model=list[RecommendationResponse])
async def get_games_from_description(request: SearchRequest):
    try:
        return get_description_recommendations(request.description, app_data['df'],
                                               app_data['model'], app_data['embeddings'],
                                               app_data['genres'], app_data['themes'], app_data['keywords'],
                                               app_data['summary'], app_data['game_to_index'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/game/{game_id}", response_model=list[RecommendationResponse])
async def get_games_from_id(game_id: int):
    try:
        return get_recommendations(game_id,
                                   app_data['df'],
                                   app_data['top_games'],
                                   app_data['game_to_index'], app_data['genres'], app_data['themes'],
                                   app_data['keywords'], app_data['summary'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations/user", response_model=list[UserRecommendationResponse])
async def get_games_from_user(request: UserGamesRequest):
    try:
        return get_recommendations_from_user(
            request.games_tuple,
            app_data['df'],
            app_data['top_games'], app_data['game_to_index'], app_data['genres'],
            app_data['themes'], app_data['keywords'], app_data['summary']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations/umap", response_model=list[UMAPPoint])
async def get_umap_points(request: UserGamesIds):
    try:
        points, game_ids, clusters = umap_visualization(
            request.game_ids,
            app_data['embeddings'],
            app_data['game_to_index']
        )
        return [
                {
                    "game_id": game_ids[i],
                    "x": float(points[i][0]),
                    "y": float(points[i][1]),
                    "cluster": clusters[i],
                } for i in range(len(game_ids))
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


