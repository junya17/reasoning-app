"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://reasoning-app.onrender.com/reasoning";

console.log("Using API URL:", API_URL);  // ✅ API URL をログ出力

if (!API_URL) {
  throw new Error("❌ API_URL が設定されていません！環境変数を確認してください。");
}

export default function ReasoningApp() {
  const [question, setQuestion] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState(null);
  // 🔥 最終的な答えを追加

  const handleAsk = async () => {
    console.log("🔄 Sending request to API..."); // ✅ 追加
    console.log("✅ API URL:", process.env.NEXT_PUBLIC_API_URL); // 🔥 ここでチェック！
    setLoading(true);
    setSteps([]);
    setFinalAnswer(null);  // 🔥 新しい質問ごとにリセット

    console.log("🔄 Sending request to API..."); // ✅ 追加
    console.log("Question:", question);  // ✅ 追加

    try {
      console.log("✅ Sending request to API:", API_URL);
      console.log("🛠 Method:", "POST");  // ここを追加
      console.log("🛠 Body:", JSON.stringify({ question }));  // ここも追加
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });


      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("FastAPI Response:", data);

      if (!data.answer) {
        throw new Error(`Invalid response format: 'answer' is missing.`);
      }

      setSteps([data.answer]);  // 🔥 `answer` を `steps` にセット
      setFinalAnswer(data.answer);  // 🔥 `finalAnswer` にもセット
    } catch (error) {
      console.error("Error fetching data:", error);
      setSteps([`エラーが発生しました: ${error.message}`]);
      setFinalAnswer("エラーが発生しました。もう一度試してください。");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">推論 AI アシスタント</h1>
      <textarea
        className="border p-2 w-full text-black placeholder:text-gray-500"
        rows="3"
        placeholder="質問を入力してください..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 mt-2 w-full"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? "推論中..." : "推論開始"}
      </button>

      {loading && <p className="mt-4 text-gray-600">AIが考えています...</p>}

      {steps.length > 0 && (
        <div className="mt-4 border p-2">
          <h2 className="font-bold mb-2">推論の流れ:</h2>
          <ul className="list-disc pl-4">
            {steps.map((step, index) => (
              <li key={index} className="fade-in">{step}</li>
            ))}
          </ul>
        </div>
      )}
      {finalAnswer && (
        <div className="mt-4 border p-2 bg-yellow-100">
          <h2 className="font-bold mb-2">💡 最終的な答え:</h2>
          <p className="text-lg">{finalAnswer}</p>
        </div>
      )}
    </div>
  );
}