import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import pickle

def get_recommendations(game_id, df, top_games, game_to_index, genres_emb, themes_emb, keywords_emb, summary_emb):
    blacklist_terms = ['edition', 'psp', 'game boy', 'remastered', 'version', 'demo', 'gbc']

    matches = df[df['id'] == game_id]
    if matches.empty or game_id not in top_games:
        return []

    source_game = matches.iloc[0]
    source_game_name = source_game['name'] if pd.notna(source_game['name']) else None
    source_franchise = source_game['franchise'] if pd.notna(source_game['franchise']) else None
    source_series = source_game['series'] if pd.notna(source_game['series']) else None

    if not source_game_name:
        return []

    source_name_words = source_game_name.lower().split()
    source_name_words = {word for word in source_name_words if len(word) > 2}
    source_idx = game_to_index[game_id]

    if not source_name_words:
        return []

    recommendations = top_games[game_id]

    potential_rec = []
    df_indexed = df.set_index('id')

    for rec_id, _ in recommendations:
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

            if len(source_name_words) > 0 and len(common_words) / len(source_name_words) > 0.25:
                continue

            if (source_franchise is not None and source_franchise == rec_franchise) or (source_series is not None and source_series == rec_series):
                continue

            if rec_id == game_id:
                continue

            if any(term in rec_name.lower() for term in blacklist_terms):
                continue

            rec_idx = game_to_index[rec_id]

            sim_genres = float(genres_emb[source_idx] @ genres_emb[rec_idx])
            sim_themes = float(themes_emb[source_idx] @ themes_emb[rec_idx])
            sim_keywords = float(keywords_emb[source_idx] @ keywords_emb[rec_idx])
            sim_summary = float(summary_emb[source_idx] @ summary_emb[rec_idx])

            explanation = {}
            explanation['genres'] = sim_genres * 100
            explanation['themes'] = sim_themes * 100
            explanation['keywords'] = sim_keywords * 100
            explanation['summary'] = sim_summary * 100

            score = (sim_genres * 0.20) + (sim_themes * 0.20) + (sim_keywords * 0.30) + (sim_summary * 0.30)

            rating = rec_game['total_score'] if pd.notna(rec_game['total_score']) else 0

            bonus_procent = 0.10
            final_score = score * (1 + (rating / 100) * bonus_procent)

            potential_rec.append({
                "id": int(rec_id),
                "name": rec_name,
                "recommendation_score": float(final_score),
                "explanation": explanation
            })

        except IndexError:
            continue

    potential_rec.sort(key=lambda x: x["recommendation_score"], reverse=True)

    print(f"\n--- Recomandări Sortate pentru: {source_game_name.upper()} ---")
    for rec in potential_rec[:6]:
        print(f"{rec['name']:<45} | {rec['id']} | Scorul Final: {rec['recommendation_score']*100:>6.2f}%")

    return potential_rec[:6]

def get_description_recommendations(description, df, model, embeddings, genres_emb, themes_emb, keywords_emb, summary_emb, game_to_index):
    user_vector = model.encode(description, convert_to_numpy=True, normalize_embeddings=True).reshape(1, -1).astype(np.float32)
    similarities = (user_vector @ embeddings.T).flatten()

    top_indices = similarities.argsort()[-50:][::-1]

    recommendations = []
    user_vector_flat = user_vector.flatten()
    bonus_procent = 0.10
    for i in top_indices:
        game_id = int(df.iloc[i]['id'])
        final_score= float(similarities[i]) * (1 + (df.iloc[i]['total_score'] / 100) * bonus_procent)
        game_idx = game_to_index[game_id]

        sim_genres = float(user_vector_flat @ genres_emb[game_idx])
        sim_themes = float(user_vector_flat @ themes_emb[game_idx])
        sim_keywords = float(user_vector_flat @ keywords_emb[game_idx])
        sim_summary = float(user_vector_flat @ summary_emb[game_idx])

        explanation = {}
        explanation['genres'] = sim_genres * 100
        explanation['themes'] = sim_themes * 100
        explanation['keywords'] = sim_keywords * 100
        explanation['summary'] = sim_summary * 100

        game_data = {
            "id": game_id,
            "name": str(df.iloc[i]['name']),
            "recommendation_score": float(final_score),
            "explanation": explanation
        }
        recommendations.append(game_data)

    recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)
    final_top = recommendations[:10]

    for game_data in final_top:
        print(f"{game_data['name']:<45} | {game_data['id']} | Scor Similitudine: {game_data['recommendation_score']*100:>6.2f}%")

    return final_top

def get_recommendations_from_user(game_ids, df, top_games, games_to_index, genres_emb, themes_emb, keywords_emb, summary_emb):
    scores = {}
    for game_id in game_ids:
        recs = get_recommendations(game_id, df, top_games, games_to_index, genres_emb, themes_emb, keywords_emb, summary_emb)

        for rec in recs:
            rec_id = rec["id"]
            score = rec["recommendation_score"]

            if rec_id in game_ids:
                continue

            if rec_id not in scores:
                scores[rec_id] = {
                    "id": rec_id,
                    "name": rec["name"],
                    "recommendation_score": score,
                    "explanation": rec["explanations"]
                }
            else:
                scores[rec_id]["recommendation_score"] = (score + scores[rec_id]["recommendation_score"]) / 2

    final_recs = list(scores.values())
    final_recs.sort(key=lambda x: x["recommendation_score"], reverse=True)

    return final_recs[:10]


# game_names = ["The Legend of Zelda: Breath of the Wild", "Dark Souls III",
#              "Sid Meier's Civilization VI", "Factorio", "The Witcher 3: Wild Hunt",
#              "Disco Elysium", "Minecraft: Java Edition", "Stardew Valley", "Celeste",
#              "Portal 2", "Overwatch 2", "Hollow Knight", "Undertale",
#              "Resident Evil 4", "Terraria"]

