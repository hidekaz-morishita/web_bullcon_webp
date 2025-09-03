import pandas as pd
import json

# Screaming FrogからエクスポートしたCSVファイルを読み込む
df = pd.read_csv('screaming_frog_crawl.csv')

# JSONに変換するための空のリスト
output_data = []

# 各行をループしてJSONオブジェクトを構築
for index, row in df.iterrows():
    # キーワードを生成（タイトル、H1、メタディスクリプションなどを結合）
    keywords = f"{row['Title']} {row['H1-1']} {row['Meta Description']}"

    item = {
        "title": row['Title'],
        "url": row['Address'],
        "keywords": keywords
    }
    output_data.append(item)

# JSONファイルとして保存
with open('search_data.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("JSONファイルが正常に作成されました。")