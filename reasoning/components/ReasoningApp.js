"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/reasoning";

console.log("Using API URL:", API_URL);  // ✅ API URL をログ出力

export default function ReasoningApp() {
  const [question, setQuestion] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setSteps([]);

    console.log("🔄 Sending request to API..."); // ✅ 追加
    console.log("Question:", question);  // ✅ 追加

    try {
      console.log("Sending request to:", API_URL);

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

      const data = await response.json();
      console.log("FastAPI Response:", data);

      if (!data.answer) {
        throw new Error(`Invalid response format: 'answer' is missing.`);
      }

      setSteps([data.answer]);  // 🔥 `answer` を `steps` にセット

    } catch (error) {
      console.error("Error fetching data:", error);
      setSteps([`エラーが発生しました: ${error.message}`]);
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
    </div>
  );
}
