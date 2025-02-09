"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://reasoning-app.onrender.com/reasoning";

export default function ReasoningApp() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer(null);

    try {
      console.log("✅ Sending request to API:", API_URL);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("FastAPI Response:", data);

      if (!data.answer) {
        throw new Error(`Invalid response format: 'answer' is missing.`);
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAnswer("エラーが発生しました。もう一度試してください。");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">推論 AI アシスタント</h1>
      <textarea
        className="border p-3 w-full text-black placeholder:text-gray-500 rounded-md"
        rows="3"
        placeholder="質問を入力してください..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white p-3 mt-4 w-full rounded-md text-lg hover:bg-blue-700 transition"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? "推論中..." : "推論開始"}
      </button>

      {loading && <p className="mt-4 text-gray-600">AIが考えています...</p>}

      {answer && (
        <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md shadow-md text-lg text-gray-800">
          <h2 className="font-bold mb-2 text-gray-900">💡 推論結果:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
