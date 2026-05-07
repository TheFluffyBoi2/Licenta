import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import pickle

def get_recommendations(game_id, df, top_games):
    blacklist_terms = ['edition', 'psp', 'game boy', 'remastered', 'version', 'demo', 'gbc']

    source_game = df[df['id'] == game_id].iloc[0]
    source_game_name = source_game['name'] if pd.notna(source_game['name']) else None
    source_franchise = source_game['franchise'] if pd.notna(source_game['franchise']) else None
    source_series = source_game['series'] if pd.notna(source_game['series']) else None

    source_name_words = source_game_name.lower().split()
    source_name_words = {word for word in source_name_words if len(word) > 2}

    recommendations = top_games[game_id]

    potential_rec = []
    df_indexed = df.set_index('id')

    for rec_id, score in recommendations:
        try:
            rec_game = df_indexed.loc[rec_id]
            rec_name = str(rec_game['name'])
            rec_franchise = str(rec_game['franchise']) if pd.notna(rec_game['franchise']) else None
            rec_series = str(rec_game['series']) if pd.notna(rec_game['series']) else None
            rec_category = str(rec_game['category'])

            rec_name_words = rec_name.lower().split()
            rec_name_words = {word for word in rec_name_words if len(word) > 2}

            common_words = source_name_words.intersection(rec_name_words)

            if rec_category != 'main_game':
                continue

            if len(common_words) / len(source_name_words) >= 0.5:
                continue

            if (source_franchise is not None and source_franchise == rec_franchise) or (source_series is not None and source_series == rec_series):
                continue

            if rec_id == game_id:
                continue

            if any(term in rec_name.lower() for term in blacklist_terms):
                continue

            rating = rec_game['total_score'] if pd.notna(rec_game['total_score']) else 0

            bonus_procent = 0.10
            final_score = score * (1 + (rating / 100) * bonus_procent)

            potential_rec.append({
                "id": int(rec_id),
                "name": rec_name,
                "score": float(final_score),
            })

        except IndexError:
            continue

    potential_rec.sort(key=lambda x: x["score"], reverse=True)

    print(f"\n--- Recomandări Sortate pentru: {source_game_name.upper()} ---")
    for rec in potential_rec[:10]:
        print(f"{rec["name"]:<45} | {rec["id"]} | Scorul Final: {rec["score"]*100:>6.2f}%")

    return potential_rec[:10]

def get_description_recommendations(description, df, model, embeddings):
    user_vector = model.encode(description).reshape(1, -1)
    similarities = cosine_similarity(user_vector, embeddings)[0]

    top_indices = similarities.argsort()[-10:][::-1]

    recommendations = []
    for i in top_indices:
        game_data = {
            "id": int(df.iloc[i]['id']),
            "name": str(df.iloc[i]['name']),
            "score": float(similarities[i])
        }
        recommendations.append(game_data)
        print(f"{game_data['name']:<45} | {game_data['id']} | Scor Similitudine: {game_data['score']*100:>6.2f}%")

    return recommendations

def get_recommendations_from_user(game_ids, df, top_games):
    scores = {}
    for game_id in game_ids:
        recs = get_recommendations(game_id, df, top_games)

        for rec in recs:
            rec_id = rec["id"]
            score = rec["score"]

            if rec_id in game_ids:
                continue

            if rec_id not in scores:
                scores[rec_id] = {
                    "id": rec_id,
                    "name": rec["name"],
                    "score": score,
                }
            else:
                scores[rec_id]["score"] = (score + scores[rec_id]["score"]) / 2

    final_recs = list(scores.values())
    final_recs.sort(key=lambda x: x["score"], reverse=True)

    return final_recs[:10]


# game_names = ["The Legend of Zelda: Breath of the Wild", "Dark Souls III",
#              "Sid Meier's Civilization VI", "Factorio", "The Witcher 3: Wild Hunt",
#              "Disco Elysium", "Minecraft: Java Edition", "Stardew Valley", "Celeste",
#              "Portal 2", "Overwatch 2", "Hollow Knight", "Undertale",
#              "Resident Evil 4", "Terraria"]

# DATA_PATH: str = 'working.csv'
# EMBEDDINGS_PATH: str = 'embeddings.pkl'
# TOP_GAMES_PATH: str = 'top_games.pkl'
# MODEL_PATH: str = './mpnet_model'

# df = pd.read_csv(DATA_PATH, usecols=['id', 'series', 'franchise', 'name', 'total_score', 'category'])

# with open(TOP_GAMES_PATH, 'rb') as f:
#     top_games = pickle.load(f)

# with open(EMBEDDINGS_PATH, 'rb') as f:
#     embeddings = pickle.load(f)

# model = SentenceTransformer(MODEL_PATH)

# get_description_recommendations("Hard platformer game precision platformer hard climb mountain", df, model, embeddings)
# get_recommendations(312638, df, top_games)
