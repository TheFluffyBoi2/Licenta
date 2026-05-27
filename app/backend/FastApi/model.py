import pandas as pd
import numpy as np
import ast
import re
import pickle
import os
import shutil
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer


DATA_PATH: str = '/kaggle/input/datasets/emirshn/igdb-dataset-for-data-mining-projects/game_dataset_cleaned.csv'
WORKING_CSV_PATH: str = 'working.csv'
SIMILARITY_MATRIX_PATH: str = 'top_games.pkl'
GAMEINDEX_DFINDEX_PATH: str = 'gameindex_dfindex.pkl'
DFINDEX_GAMEINDEX_PATH: str = 'dfindex_gameindex.pkl'
SAVED_DATA_PATH: str = 'data.pkl'

def clean_keywords(keywords_str: str) -> str:
    keywords_list = ast.literal_eval(keywords_str)

    bad_patterns = [
            r'\bsteam\b', r'playstation', r'xbox', r'nintendo', r'wii\b', r'\bdsi\b',
            r'gameboy', r'game boy', r'apple arcade', r'google play', r'windows_store',
            r'\bpax\b', r'\be3\b', r'gamescom', r'tokyo_game_show', r'nextfest', r'game_awards',
            r'controller', r'mouse', r'keyboard', r'gamepad', r'joystick', r'touchscreen',
            r'achievement', r'trading_card', r'leaderboard', r'cloud_save',
            r'digital_distribution', r'exclusive', r'downloadable_content', r'\bdlc\b',
            r'ai-generated', r'kickstarter', r'microtransaction', r'in-app', r'free-to-play',
            r'\b20[0-2][0-9]\b', r'\b19[8-9][0-9]\b', r'remastered', r'definitive_edition'
        ]

    exact_bad_words = {
        'licensed game', 'unlicensed game', 'sequel', 'prequel', 'year in the title',
        "protagonist's name in the title", 'demo', 'free demo', 'abandonware', 'vaporware',
        'games on demand', 'greatest hits',
        'early access', 'manual included', 'physical copy protection', 'launch titles',
        'fan translation - english', 'fan translation - portuguese'
    }

    clean_list = []
    for keyword in keywords_list:
        clean_keyword = keyword.lower().strip()

        if clean_keyword in exact_bad_words:
            continue

        is_bad = any(re.search(p, clean_keyword) for p in bad_patterns)

        if not is_bad and len(clean_keyword) >= 2:
            clean_list.append(clean_keyword)

    return " ".join(clean_list)

def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    return df;

def process_data(df: pd.DataFrame) -> pd.DataFrame:
    print("Started processing")

    def parse_string(string: str) -> str:
        items = ast.literal_eval(string)
        return ' '.join([str(item).lower().strip() for item in items])

    def clean_summary(summary, game_name) -> str:
        if pd.isna(summary) or summary == "":
            return ""
        summary = str(summary).lower()
        game_name = str(game_name).lower()

        pattern = re.compile(re.escape(game_name), re.IGNORECASE)
        summary = pattern.sub("the game", summary)

        summary = re.sub(r'[^a-z\s]', '', summary)

        clean_summary = " ".join(summary.split())

        return clean_summary

    working_df = df.dropna(subset=['genres', 'themes', 'keywords', 'summary', "player_perspectives"]).copy()
    working_df["total_score"] = working_df["aggregated_rating"].fillna(working_df["rating"]).fillna(0)
    working_df = working_df.sort_values(by="total_score", ascending=False)
    working_df = working_df.head(30_000).copy()
    working_df = working_df.reset_index(drop=True)

    print("Size", working_df.count())

    working_df["genres_str"] = working_df["genres"].apply(parse_string)
    working_df["themes_str"] = working_df["themes"].apply(parse_string)
    working_df["keywords_str"] = working_df["keywords"].apply(clean_keywords)
    working_df["summary_clean"] = working_df.apply(
        lambda row: clean_summary(row['summary'], row['name']),
        axis=1
    )

    genres = working_df["genres_str"].fillna("Unknown")
    themes = working_df["themes_str"].fillna("Unknown")
    keywords = working_df["keywords_str"].fillna("")
    summary = working_df["summary_clean"].fillna("")

    working_df["content"] = (
        ("Genres: " + genres + ". ") * 5 +
        ("Themes: " + themes + ". ") * 3 +
        "Game summary: " + summary
    )

    working_df["content"] = working_df["content"].apply(lambda x: re.sub(r'\s+', ' ', str(x)).strip())

    working_df.to_csv(WORKING_CSV_PATH)

    print("Finished processing")
    return working_df

def fit(df: pd.DataFrame):
    sentences = df["content"].fillna("").astype(str).tolist()
    genres = df["genres_str"].fillna("").astype(str).tolist()
    themes = df["themes_str"].fillna("").astype(str).tolist()
    keywords = df["keywords_str"].fillna("").astype(str).tolist()
    summary = df["summary_clean"].fillna("").astype(str).tolist()

    model = SentenceTransformer("all-mpnet-base-v2")

    print("Generating embeddings")
    main_embeddings = model.encode(sentences,
                                  convert_to_numpy=True,
                                  normalize_embeddings=True).astype(np.float32)
    genres_embeddings = model.encode(genres,
                                  convert_to_numpy=True,
                                  normalize_embeddings=True).astype(np.float32)
    themes_embeddings = model.encode(themes,
                                  convert_to_numpy=True,
                                  normalize_embeddings=True).astype(np.float32)
    keywords_embeddings = model.encode(keywords,
                                  convert_to_numpy=True,
                                  normalize_embeddings=True).astype(np.float32)
    summary_embeddings = model.encode(summary,
                                  convert_to_numpy=True,
                                  normalize_embeddings=True).astype(np.float32)

    model.save('mpnet_model')
    shutil.make_archive('mpnet_model', 'zip', '/kaggle/working/mpnet_model')

    return (main_embeddings, genres_embeddings, themes_embeddings,
            keywords_embeddings, summary_embeddings)


def save_data(df: pd.DataFrame, main_embeddings: np.ndarray,
              genres_embeddings: np.ndarray, themes_embeddings: np.ndarray,
              keywords_embeddings: np.ndarray, summary_embeddings: np.ndarray,
              top_n: int = 100) -> None:
    print("Started saving")

    top_sim_dict = {}
    batch_size = 1000

    df = df.reset_index(drop=True)

    w_genres = 0.30
    w_themes = 0.30
    w_keywords = 0.30
    w_summary = 0.10

    for i in range(0, len(main_embeddings), batch_size):
        end = min(i + batch_size, len(main_embeddings))

        sim_genres = genres_embeddings[i:end] @ genres_embeddings.T
        sim_themes = themes_embeddings[i:end] @ themes_embeddings.T
        sim_keywords = keywords_embeddings[i:end] @ keywords_embeddings.T
        sim_summary = summary_embeddings[i:end] @ summary_embeddings.T

        chunk_sim = (w_genres * sim_genres) + (w_themes * sim_themes) + \
                    (w_keywords * sim_keywords) + (w_summary * sim_summary)

        for chunk_row in range(chunk_sim.shape[0]):
            global_idx = i + chunk_row
            game_id = int(df["id"].iloc[global_idx])

            similar_indices = np.argsort(chunk_sim[chunk_row])[-(top_n + 1):-1][::-1]

            top_sim_dict[game_id] = [
                (int(df["id"].iloc[idx]), float(chunk_sim[chunk_row][idx]))
                for idx in similar_indices
            ]

    game_id_to_index = {
        int(game_id) : index
        for index, game_id in enumerate(df["id"])
    }

    index_to_game_id = {
        index : int(game_id)
        for index, game_id in enumerate(df["id"])
    }

    with open(SAVED_DATA_PATH, 'wb') as f:
        pickle.dump({
            "top_sim_dict": top_sim_dict,
            "game_to_index": game_id_to_index,
            "index_to_game": index_to_game_id,
            "main": main_embeddings,
            "genres": genres_embeddings,
            "themes": themes_embeddings,
            "keywords": keywords_embeddings,
            "summary": summary_embeddings
        }, f)
    print("Finished saving")

def train_model():
    df: pd.DataFrame = load_data()
    processed_df: pd.DataFrame = process_data(df)
    (me, ge, te, ke, se) = fit(processed_df)
    save_data(processed_df, me, ge, te, ke, se)

train_model()
