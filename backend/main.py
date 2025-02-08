from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

app = FastAPI()

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可（開発用）
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

class Query(BaseModel):
    question: str

@app.get("/")  # ← これを追加
def home():
    return {"message": "FastAPI is running!"}

@app.post("/reasoning")
def get_reasoning(query: Query):
    try:
        prompt = f"""
        あなたは高度な推論AIです。  
        問題を即座に解決するのではなく、次の手順に従って **ステップごとに推論** してください。

        ---

        ### **🛠 推論プロセス**
        1️⃣ **問題を分析し、理解する**
        - 問題の主な要素を分解
        - 必要な情報を整理

        2️⃣ **可能な解決アプローチをリストアップ**
        - 数学的推論 / 因果関係の特定 / 事例ベースの分析 など
        - どの方法が適切かを選択

        3️⃣ **初回の推論を実施**
        - 選択したアプローチに基づいて答えを導き出す

        4️⃣ **自己フィードバック**
        - 「この推論は正しいか？」を自分でチェック
        - 不足があれば、再推論

        5️⃣ **最終結論を出力**
        - すべての情報を統合し、論理的に妥当な解答を作成

        ---

        ### **📌 出力形式**
        あなたの考えを **ステップごとに順番に出力してください**。  
        **一度にすべての結論を出すのではなく、段階的に思考を進めるようにしてください。**

        ユーザーの質問: {query.question}
        """

        response = openai.ChatCompletion.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[{"role": "system", "content": "あなたは推論が得意なAIです。"},
                    {"role": "user", "content": prompt}]
        )

        # デバッグ用にレスポンスを表示
        print("=== FastAPI Response ===")
        print({"question": query.question, "answer": response["choices"][0]["message"]["content"]})
        
        return {"question": query.question, "answer": response["choices"][0]["message"]["content"]}

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}