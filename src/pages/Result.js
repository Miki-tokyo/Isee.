import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/Questionnaire.css";
import "./Result.css";
import home from "../image/home.png"

function Result({ submitToDify, answers }) {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentQuestionId = location.state?.currentQuestionId || 25; // 受け取ったcurrentQuestionIdを使用（デフォルト25）

  const handleSubmitToDify = async () => {
    // Difyに送信
    await submitToDify(answers);
    navigate("/chat-screen"); // 最終画面へ遷移（任意の画面）
  };

  const handleGoBack = () => {
    if (currentQuestionId === 25) {
      navigate(`/question/25`); // 質問IDが25のページに戻る
    }
  };

  const handleGoHome = () => {
    navigate("/"); // ホームに戻る
  };

  return (
    <div className="result-page">    
      <button className="result-button" onClick={handleSubmitToDify}>
        結果をみる
      </button>

      {/* 戻るボタン */}
      <button onClick={handleGoBack} className="back-button">
        ←前に戻る
      </button>
      
      {/* ホームに戻るボタン */}
      <button onClick={handleGoHome} className="home-button">
        <img src={home} alt="home-icon" className="home-icon" />ホームに戻る
      </button>

      <div className="result-message">
        ※ボタンは1回だけクリックしてください。
      </div>
    </div>
  );
}

export default Result;