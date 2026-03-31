from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/recommendations/{game_id}")
async def get_recommendations(game_id: int):
    pass

@app.get("/recommendations/{user_id}")
async def get_recommendations(user_id: int):
    pass


