import pandas as pd
import numpy as np
import ast
import re
import pickle
import os
import shutil
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer


DATA_PATH: str = 'game_dataset_cleaned.csv'
WORKING_CSV_PATH: str = 'working.csv'
SIMILARITY_MATRIX_PATH: str = 'top_games.pkl'
GAMEINDEX_DFINDEX_PATH: str = 'gameindex_dfindex.pkl'
DFINDEX_GAMEINDEX_PATH: str = 'dfindex_gameindex.pkl'
EMBEDDINGS_PATH: str = 'embeddings.pkl'

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

        summary = re.sub(r'\d+', '', summary)
        summary = re.sub(r'[^a-z\s]', '', summary)

        clean_summary = " ".join(summary.split())

        return clean_summary

    working_df = df.dropna(subset=['genres', 'themes', 'keywords', 'summary', "player_perspectives"]).copy()
    working_df["total_score"] = working_df["aggregated_rating"].fillna(working_df["rating"]).fillna(0)
    working_df = working_df.sort_values(by="total_score", ascending=False)
    working_df = working_df.head(55_000).copy()
    working_df = working_df.reset_index(drop=True)

    print("Size", working_df.count())

    working_df["genres_str"] = working_df["genres"].apply(parse_string)
    working_df["themes_str"] = working_df["themes"].apply(parse_string)
    working_df["player_perspectives_str"] = working_df["player_perspectives"].apply(parse_string)
    working_df["keywords_str"] = working_df["keywords"].apply(clean_keywords)
    working_df["summary_clean"] = working_df.apply(
        lambda row: clean_summary(row['summary'], row['name']),
        axis=1
    )

    genres = working_df["genres_str"].fillna("Unknown")
    themes = working_df["themes_str"].fillna("Unknown")
    player_prespectives = working_df["player_perspectives_str"].fillna("Unknown")
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

def fit(df: pd.DataFrame) -> np.ndarray:
    sentences = df["content"].fillna("").astype(str).tolist()

    model = SentenceTransformer("all-mpnet-base-v2")

    print("Generating embeddings")
    embeddings = model.encode(sentences)

    model.save('mpnet_model')
    shutil.make_archive('mpnet_model', 'zip', '/kaggle/working/mpnet_model')

    return embeddings.astype(np.float32)


def save_data(df: pd.DataFrame, lsa_matrix: np.ndarray, top_n: int = 50) -> None:
    print("Started saving")

    top_sim_dict = {}
    batch_size = 1000

    df = df.reset_index(drop=True)

    for i in range(0, len(lsa_matrix), batch_size):
        end = min(i + batch_size, len(lsa_matrix))

        chunk_sim = cosine_similarity(lsa_matrix[i:end], lsa_matrix).astype(np.float32)

        for chunk_row in range(chunk_sim.shape[0]):
            global_idx = i + chunk_row
            game_id = int(df["id"].iloc[global_idx])

            similar_indices = np.argsort(chunk_sim[chunk_row])[-(top_n + 1):-1][::-1]

            top_sim_dict[game_id] = [
                (int(df["id"].iloc[idx]), float(chunk_sim[chunk_row][idx]))
                for idx in similar_indices
            ]

    with open(SIMILARITY_MATRIX_PATH, 'wb') as f:
        pickle.dump(top_sim_dict, f)

    game_id_to_index = {
        int(game_id) : index
        for index, game_id in enumerate(df["id"])
    }

    index_to_game_id = {
        index : int(game_id)
        for index, game_id in enumerate(df["id"])
    }

    with open(GAMEINDEX_DFINDEX_PATH, 'wb') as f:
        pickle.dump(game_id_to_index, f)
    with open(DFINDEX_GAMEINDEX_PATH, 'wb') as f:
        pickle.dump(index_to_game_id, f)
    with open(EMBEDDINGS_PATH, 'wb') as f:
        pickle.dump(lsa_matrix, f)
    print("Finished saving")

def train_model():
    df: pd.DataFrame = load_data()
    processed_df: pd.DataFrame = process_data(df)
    result: np.ndarray = fit(processed_df)
    save_data(processed_df, result)

train_model()
