import pickle
import pandas as pd
import numpy as np

SIMILARITY_MATRIX_PATH: str = 'similarity_matrix.pkl'
GAMEINDEX_DFINDEX_PATH: str = 'gameindex_dfindex.pkl'
DFINDEX_GAMEINDEX_PATH: str = 'dfindex_gameindex.pkl'

def display_games(df_games, title="Jocuri:"):
    print(f"\n--- {title} ---")
    for index, row in df_games.iterrows():
        name = str(row['name'])

        print(f"ID: {row['id']} | Nume: {name}")

def similar_games(target_idx=391): # Folosim indexul 391 pe care l-ai pus tu
    with open(SIMILARITY_MATRIX_PATH, 'rb') as f:
        similar_matrix = pickle.load(f)
    with open(DFINDEX_GAMEINDEX_PATH, 'rb') as f:
        index_to_game_id = pickle.load(f)

    df = pd.read_csv('game_dataset_cleaned.csv')

    # 1. Obținem scorurile pentru rândul dorit
    all_scores = similar_matrix[target_idx]

    # 2. Luăm indicii celor mai bune 10 recomandări (excluzând jocul însuși)
    # np.argsort ne dă indicii sortați crescător după scor
    recommended_indices = np.argsort(all_scores)[-11:-1][::-1]

    # 3. Extragem ID-urile și SCORURILE corespunzătoare
    results = []
    for i in recommended_indices:
        game_id = index_to_game_id[i]
        score = all_scores[i]
        results.append({'id': game_id, 'similarity': score})

    # 4. Mapăm cu datele din DataFrame
    # Folosim un loop pentru a afișa frumos scorul lângă nume
    print(f"\n--- JOCUL CĂUTAT: {df[df['id'] == index_to_game_id[target_idx]]['name'].values[0]} ---")
    print(f"{'Nume Joc':<40} | {'Potrivire':<10}")
    print("-" * 55)

    for res in results:
        game_data = df[df['id'] == res['id']]
        if not game_data.empty:
            name = game_data.iloc[0]['name']
            # Afișăm scorul ca procent (ex: 0.85 -> 85.0%)
            print(f"{name[:38]:<40} | {res['similarity']*100:>8.2f}%")


def get_terraria_index():
    df = pd.read_csv('game_dataset_cleaned.csv')

    # CORECTAT: Încărcăm dicționarul {ID : Index}
    with open(GAMEINDEX_DFINDEX_PATH, 'rb') as f:
        real_id_to_matrix_idx = pickle.load(f)

    # 1. Găsim ID-ul real
    game_row = df[df['name'] == 'Stardew Valley']

    if not game_row.empty:
        real_id = game_row.iloc[0]['id']
        print(f"ID-ul real (IGDB) pentru Terraria este: {real_id}")

        # 2. Aflăm poziția în matrice
        try:
            game_idx_in_matrix = real_id_to_matrix_idx[real_id]
            print(f"Indexul CORECT în matrice pentru Terraria este: {game_idx_in_matrix}")
            return game_idx_in_matrix
        except KeyError:
            print("Terraria nu a intrat în TOP 10.000.")

def export_games_to_file(filename="lista_jocuri_model.txt"):
    # 1. Încărcăm maparea (id-urile care au intrat în modelul de 10k)
    with open('dfindex_gameindex.pkl', 'rb') as f:
        id_to_idx_mapping = pickle.load(f)

    loaded_ids = list(id_to_idx_mapping.keys())

    # 2. Încărcăm dataset-ul original
    df = pd.read_csv('game_dataset_cleaned.csv')

    # 3. Filtrăm jocurile care sunt în model
    loaded_games_df = df[df['id'].isin(loaded_ids)].copy()

    # Sortăm alfabetic după nume
    loaded_games_df = loaded_games_df.sort_values(by='name')

    # 4. Scriem în fișier
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"TOTAL JOCURI IN MODEL: {len(loaded_games_df)}\n")
        f.write("="*50 + "\n\n")

        # Verificare rapidă pentru jocurile menționate de tine
        target_indies = ["Terraria", "Stardew Valley"]
        f.write("VERIFICARE INDIE HITS:\n")
        for indie in target_indies:
            exists = loaded_games_df['name'].str.contains(indie, case=False).any()
            f.write(f"- {indie}: {'GASIT' if exists else 'NU EXISTA IN TOP 10K'}\n")

        f.write("\n" + "="*50 + "\n")
        f.write("LISTA COMPLETA (ALFABETIC):\n")
        f.write("="*50 + "\n")

        # Scriem fiecare nume
        for name in loaded_games_df['name']:
            f.write(f"{name}\n")

    print(f"Gata! Am scris toate jocurile în fișierul: {filename}")

# Rulează funcția
# export_games_to_file()

def get_recommendations(game_name):
    df = pd.read_csv('game_dataset_cleaned.csv')

    # Încărcăm mapările
    with open(GAMEINDEX_DFINDEX_PATH, 'rb') as f:
        id_to_idx = pickle.load(f)
    with open(DFINDEX_GAMEINDEX_PATH, 'rb') as f:
        idx_to_id = pickle.load(f)
    with open(SIMILARITY_MATRIX_PATH, 'rb') as f:
        matrix = pickle.load(f)

    # Găsim ID-ul după nume
    try:
        game_id = df[df['name'].str.contains(game_name, case=False, na=False)].iloc[0]['id']
        matrix_idx = id_to_idx[game_id]
    except (IndexError, KeyError):
        print(f"Jocul '{game_name}' nu a fost găsit sau nu e în model.")
        return

    # Calculăm recomandările
    scores = matrix[matrix_idx]
    top_indices = np.argsort(scores)[-11:-1][::-1]

    print(f"\n--- Recomandări pentru: {game_name.upper()} ---")
    for i in top_indices:
        rec_id = idx_to_id[i]
        rec_name = df[df['id'] == rec_id]['name'].values[0]
        score = scores[i]
        print(f"{rec_name:<40} | {score*100:>6.2f}%")

# Acum poți testa rapid:
get_recommendations("Terraria")
get_recommendations("Minecraft")
get_recommendations("Stardew Valley")


# get_terraria_index()
# export_games_to_file()


# get_terraria()
