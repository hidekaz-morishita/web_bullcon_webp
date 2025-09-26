# -*- coding: utf-8 -*-


# 
# サイト内検索用メタデータjsonを生成するpyスクリプト
# 使い方
#  pip 「beautifulSoup4」 「lxml」をインストール
#  python generate_meta_json.py 実行

import os
import json
from bs4 import BeautifulSoup
from collections import Counter
import re

# 検索対象のHTMLファイルがあるディレクトリのパス

target_directory = '../'
output_file = 'search_data.json'

def get_meta_keywords(soup):
    """
    HTMLからメタキーワードを取得する関数。
    メタキーワードがない場合は、本文からキーワードを抽出する。
    """
    meta_tag = soup.find('meta', attrs={'name': 'keywords'})
    if meta_tag and 'content' in meta_tag.attrs:
        # メタキーワードが存在する場合
        return meta_tag['content']
    else:
        # メタキーワードがない場合、本文からキーワードを抽出
        return extract_keywords_from_body(soup)

def extract_keywords_from_body(soup):
    """
    HTMLの本文からキーワードを抽出する関数。
    """
    body_text = ''
    body_tag = soup.find('body')
    if body_tag:
        # スクリプトやスタイルタグを排除してテキストを取得
        for script_or_style in body_tag(["script", "style"]):
            script_or_style.decompose()
        body_text = body_tag.get_text()

    # 日本語のストップワードリスト (一般的な単語)
    stopwords = set([
        'て', 'に', 'を', 'は', 'が', 'の', 'と', 'も', 'より', 'から', 'まで', 'で', 'や', 'な', 'ば', 'れ', 'さ',
        'だ', 'ます', 'です', 'こと', 'もの', 'よう', 'ため', 'など', 'これ', 'それ', 'あれ', 'どこ', 'いつ',
        'どう', 'する', 'なる', 'ある', 'いる', 'ない', 'れる', 'られる', 'いく', 'くる', 'いう', 'なるほど', 'しかし'
    ])
    
    # 連続するスペースや改行を一つのスペースに変換
    text = re.sub(r'\s+', ' ', body_text)
    
    # 単語に分割し、ストップワードを除外
    words = [word for word in text.split() if word not in stopwords and len(word) > 1]
    
    # 単語の出現頻度をカウント
    word_counts = Counter(words)
    
    # 出現頻度の高い上位10個の単語をキーワードとして返す
    most_common_words = [word for word, count in word_counts.most_common(10)]
    
    return ', '.join(most_common_words)

def get_page_title(soup):
    """
    HTMLからページのタイトルを取得する関数
    """
    title_tag = soup.find('title')
    if title_tag:
        return title_tag.text.strip()
    return ""

def main():
    """
    ディレクトリ内のHTMLファイルを処理してJSONを生成するメイン関数
    """
    search_data = []
    
    # 検索対象から除外するディレクトリとファイルのリスト
    # ディレクトリ名とファイル名をそのまま指定します。
    exclude_items = {
        'distributors',
        'archive',
        'images',
        'Scripts',
        'free_tving_conf_link',
        'DROP',
        'magicone_bc_link',
        'magicone_conf_link',
        'magicone_op_link',
        'magicone_rrr_link',
        'magicone_vtr_link',
        'magicone_vtrhdmi_link',
        'magicone_vtrrca_link',
        'Qav-c23',
        '旧R11＿20190129まで',
        'kn.htm',
        'mg.htm',
        'st.htm',
        'kn',
        'mg',
        'st',
        'hole_size_list',
        'sph_notice.htm',
        'cdv01_spec.htm',
        'av-c64.html',
        'steering_sw_exc.htm'
    }
    
    # 製品データJSONを読み込み、URLとnameをマッピング
    product_keywords_map = {}
    try:
        with open(os.path.join(target_directory, 'products/products_data.json'), 'r', encoding='utf-8') as f:
            products_data = json.load(f)
            for category in products_data['products_data']['categories']:
                for product in category['products']:
                    # サブページのnameをリストとして取得
                    sub_page_names = [sub_page['name'] for sub_page in product['sub_pages']]
                    
                    # JSONのURLから '/html/' を取り除き、スラッシュを整形
                    main_url = product['main_page']['url'].replace('/html/', '').replace('\\', '/')
                    
                    # 親ページには、自身の名前とサブページの名前をすべてキーワードとしてマップに登録
                    product_keywords_map[main_url] = [product['name']] + sub_page_names

                    # サブページには、自身の名前をキーワードとしてマップに登録
                    for sub_page in product['sub_pages']:
                        sub_url = sub_page['url'].replace('/html/', '').replace('\\', '/')
                        product_keywords_map[sub_url] = [sub_page['name']]
    except FileNotFoundError:
        print("製品データJSONファイル 'products/products_data.json' が見つかりませんでした。")
    except Exception as e:
        print(f"製品データJSONファイルの読み込み中にエラーが発生しました: {e}")

    # ディレクトリ内のファイルを再帰的に探索
    for root, dirs, files in os.walk(target_directory):
        # 除外ディレクトリのチェック
        dirs[:] = [d for d in dirs if d not in exclude_items]
        
        for file in files:
            # 除外ファイルのチェック
            if file in exclude_items:
                print(f"Skipping excluded file: {os.path.join(root, file)}")
                continue

            if file.endswith(('.html', '.htm')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        html_content = f.read()
                    
                    soup = BeautifulSoup(html_content, 'lxml')
                    
                    title = get_page_title(soup)
                    keywords = get_meta_keywords(soup)
                    
                    # HTMLファイルのURLをJSONデータと一致させるために整形
                    url_relative_to_root = os.path.relpath(file_path, start=target_directory)
                    url_relative_to_root = url_relative_to_root.replace(os.sep, '/')
                    
                    # URLから製品名をキーワードに追加
                    # URLにクエリストリングが含まれている場合、それも考慮する
                    base_url = url_relative_to_root.split('?')[0]
                    if base_url in product_keywords_map:
                        product_names = product_keywords_map[base_url]
                        
                        # 既存のキーワードがあれば結合、なければ新しいキーワードとして設定
                        if keywords:
                            keywords_list = [kw.strip() for kw in keywords.split(',')]
                            keywords_list.extend(product_names)
                            keywords = ', '.join(keywords_list)
                        else:
                            keywords = ', '.join(product_names)
                    
                    if title and keywords:
                        page_data = {
                            "title": title,
                            "url": f"/html/{url_relative_to_root}",
                            "keywords": keywords
                        }
                        search_data.append(page_data)
                        print(f"Processed: {file_path}")

                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

    # 検索データをJSONファイルに書き出し
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(search_data, f, ensure_ascii=False, indent=2)

    print(f"\nJSON file '{output_file}' has been generated.")

if __name__ == "__main__":
    main()
