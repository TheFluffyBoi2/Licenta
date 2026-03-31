# import pandas as pd
# import ast
# import re

# # Rulează asta pe dataset-ul tău curățat
# df = pd.read_csv('game_dataset_cleaned.csv')

# def find_trash_keywords(df):
#     all_kws = set()
#     for row in df['keywords'].dropna():
#         try:
#             l = ast.literal_eval(row)
#             for k in l:
#                 all_kws.add(k.lower().strip())
#         except: continue

#     # Cuvinte cheie care indică de obicei un keyword "BAD"
#     trash_indicators = [
#         'steam', 'playstation', 'xbox', 'nintendo', 'wii', 'dsi', 'pax', 'e3',
#         'gamescom', 'nextfest', 'award', 'edition', 'version', 'bundle', 'pack',
#         'dlc', 'exclusive', 'multiplayer only', 'single-player only', 'support',
#         'controller', 'achievements', 'trading cards', 'leaderboards', 'distribution',
#         '201', '202', '199', '198' # Prinde anii (2014, 2025, etc.)
#     ]

#     bad_found = [kw for kw in all_kws if any(ind in kw for ind in trash_indicators)]
#     return sorted(bad_found)

# blacklist = find_trash_keywords(df)
# print(f"Am găsit {len(blacklist)} keywords de eliminat.")
# # Salvează-le ca să le vezi
# with open('blacklist_automata.txt', 'w') as f:
#     for item in blacklist:
#         f.write(f"'{item}',\n")

import pandas as pd
import ast
from collections import Counter

def get_all_keywords_report(input_file='game_dataset_cleaned.csv', output_file='raport_keywords.csv'):
    df = pd.read_csv(input_file)

    # Ne asigurăm că nu avem valori nule
    df['keywords'] = df['keywords'].fillna('[]')

    all_keywords = []

    print("Analizăm keywords... Te rog așteaptă.")

    for row in df['keywords']:
        try:
            # Transformăm string-ul "['a', 'b']" în listă reală ['a', 'b']
            kw_list = ast.literal_eval(row)
            if isinstance(kw_list, list):
                # Le facem litere mici ca să nu avem duplicate gen "RPG" și "rpg"
                all_keywords.extend([k.lower().strip() for k in kw_list])
        except (ValueError, SyntaxError):
            continue

    # Numărăm aparițiile fiecărui keyword
    counts = Counter(all_keywords)

    # Cream un DataFrame pentru raport
    report_df = pd.DataFrame(counts.items(), columns=['Keyword', 'Frequency'])

    # Sortăm descrescător după frecvență
    report_df = report_df.sort_values(by='Frequency', ascending=False)

    # Salvăm raportul
    report_df.to_csv(output_file, index=False)

    print(f"Gata! Am găsit {len(report_df)} keywords unice.")
    print(f"Raportul a fost salvat în: {output_file}")

    # Afișăm și primele 30 de keywords aici în consolă
    print("\nTop 30 cele mai frecvente keywords:")
    print(report_df.head(30).to_string(index=False))

# Rulează funcția
get_all_keywords_report()
