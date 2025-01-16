import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import Questionnaire from "./components/Questionnaire";
import Result from "./pages/Result"
import axios from "axios";
import "./App.css";
import home from "./image/home.png"
import ic from "./image/ic.png"
import user from "./image/user.png"

function App() {
  const [answers, setAnswers] = useState({}); // 回答を管理する状態
  const [loading, setLoading] = useState(false); // ローディング状態
  const [difyResponse, setDifyResponse] = useState(""); // Difyからの回答
  const [conversationId, setConversationId] = useState(""); // Difyの会話IDを保持
  const [messages, setMessages] = useState([
    { sender: "bot", text: "こんにちは！診断結果をお伝えします。" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [requestCount, setRequestCount] = useState(0); // リクエスト回数を追跡
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理

  // Difyからの回答があれば、メッセージに追加する
  useEffect(() => {
    if (difyResponse) {
      const botMessage = {
        sender: "bot",
        text: difyResponse || "Difyからの応答がありません。",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  }, [difyResponse]);

  // conversationId が更新されたときにログを出力
  useEffect(() => {
    console.log("App.js で更新された conversation_id:", conversationId);
  }, [conversationId]);

  const API_URL = "https://api.dify.ai/v1/chat-messages";
  const API_KEY = "app-gKG0pMYBwJh6oV85gBAJGLBP"; // 環境変数からAPIキーを取得

  useEffect(() => {
      // handleButtonClick をグローバルスコープに登録
      window.handleButtonClick = (message) => {
        handleButtonClick(message);
      };
  
      // コンポーネントがアンマウントされるときに登録を解除
      return () => {
        delete window.handleButtonClick;
      };
    }, [conversationId]); // 最新の conversationId を使うため依存関係に追加

  // submitToDify 関数
  const submitToDify = async (currentAnswers) => {
    setLoading(true);
    try {
      const requestData = {
        inputs: { ...currentAnswers, },
        query: "教えて",
        response_mode: "blocking",
        conversation_id: "",
        user: "abc-123",
      };
      console.log("リクエストデータ(submitToDify):", requestData);
  
      const response = await axios.post(API_URL, requestData, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Dify API応答:", JSON.stringify(response.data, null, 2));
      console.log("conversation_id:", response.data.conversation_id)

      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }

      const botMessage = {
        sender: "bot",
        text: response.data.answer, // ここではそのまま保持
      };
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: response.data.answer }, // 応答をチャット形式で追加
      ]);
    } catch (error) {
      console.error("Error in submitToDify:", error.response?.data || error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "エラーが発生しました。再試行してください。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // submitToDify_2 関数
  const submitToDify_2 = async (message) => {
    setLoading(true);
    try {
      const requestData = {
        inputs: {},
        query: message,
        response_mode: "blocking",
        conversation_id: conversationId,
        user: "abc-123",
      };
      console.log("リクエストデータ(submitToDify_2):", requestData);
  
      const response = await axios.post(API_URL, requestData, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Dify API応答:", JSON.stringify(response.data, null, 2));
      console.log("conversation_id:", response.data.conversation_id)

      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: response.data.answer }, // 応答をチャット形式で追加
      ]);
    } catch (error) {
      console.error("Error in submitToDify_2:", error.response?.data || error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "エラーが発生しました。再試行してください。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  //
  const handleButtonClick = (dataMessage) => {
    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: dataMessage }]);
    submitToDify_2(dataMessage);
  };

  const handleSendMessage = () => {
    if (userMessage.trim() === "") return;
    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userMessage }]);

    // リクエスト回数に応じて適切な関数を呼び出す
    if (requestCount === 0) {
      submitToDify(userMessage); // 初回は submitToDify
    } else {
      submitToDify_2(userMessage); // 2回目以降は submitToDify_2
    }

    setRequestCount((prevCount) => prevCount + 1); // リクエスト回数を更新
    setUserMessage(""); // 入力フィールドをクリア
  };

  const renderMessageContent = (message) => {
    const linkRegex = /<a href="(.*?)">(.*?)<\/a>/g;
    const buttonRegex = /<button[^>]*data-message="(.*?)"[^>]*>(.*?)<\/button>/g;
    const newlineRegex = /\n/g;
  
    let parts = [];
    let lastIndex = 0;
  
    // 統一的にリンク、ボタン、テキストを処理
    const processMessage = (message, regex, renderFn) => {
      let match;
      while ((match = regex.exec(message)) !== null) {
        const [fullMatch] = match;
        const beforeText = message.slice(lastIndex, match.index);
  
        // 改行を分割しながら前のテキストを追加
        if (beforeText) {
          beforeText.split(newlineRegex).forEach((line, idx, arr) => {
            parts.push(<span key={`text-${lastIndex}-${idx}`}>{line}</span>);
            if (idx < arr.length - 1) parts.push(<br key={`br-${lastIndex}-${idx}`} />);
          });
        }
  
        // 要素を追加（リンクまたはボタン）
        parts.push(renderFn(match));
        lastIndex = regex.lastIndex;
      }
    };
  
    // リンクを処理
    processMessage(message, linkRegex, ([, url, linkText]) => (
      <a
        key={`link-${url}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        {linkText}
      </a>
    ));
  
    // ボタンを処理
    processMessage(message, buttonRegex, ([, dataMessage, buttonText]) => {
      // 特定のボタンにスタイルを変更
      const isHighlightedButton =
        dataMessage === "個別相談のため、これまでの会話をまとめる" || dataMessage === "相続税の個別相談のため、これまでの会話をまとめる";
  
      return (
        <button
          key={`button-${dataMessage}`}
          onClick={() => handleButtonClick(dataMessage)}
          style={{
            backgroundColor: isHighlightedButton ? "#DB7093" : "#1E899D", // 特定のボタンはゴールド
            color: "white", /* テキスト色 */
            fontSize: "16px", // 文字サイズを指定
            padding: "5px 10px", /* 内側の余白 */
            border: "none", /* 枠線なし */
            borderRadius: "5px", /* 角丸 */
            cursor: "pointer", /* マウスホバー時にポインター表示 */
            transition: "background-color 0.3s ease", /* ホバー時のスムーズな変化 */
          }}
        >
          {buttonText}
        </button>
      );
    });
  
    // 残りのテキスト（改行を反映しつつ追加）
    if (lastIndex < message.length) {
      message.slice(lastIndex).split(newlineRegex).forEach((line, idx, arr) => {
        parts.push(<span key={`text-${lastIndex}-${idx}`}>{line}</span>);
        if (idx < arr.length - 1) parts.push(<br key={`br-${lastIndex}-${idx}`} />);
      });
    }
  
    return parts;
  };

  return (
    <Routes>
    {/* ホーム画面 */}
    <Route path="/" element={<Home />} />
    
    {/* LogIn画面 */}
    <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
    <Route path="/signup" element={<SignUp />} />
    
    {/* 質問画面 */}
    <Route
      path="/questionnaire"
      element={
        <Questionnaire
          onComplete={() => navigate("/result")} // 完了後結果ページに遷移
          answers={answers}
          setAnswers={setAnswers} // 回答を保存
        />
      }
    />

    {/* 結果画面 */}
    <Route
      path="/result"
      element={
        <Result
          onContinue={() => navigate("/chat-screen")} // 続けてチャット画面に遷移
          submitToDify={() => submitToDify(answers)} // 回答を送信
          answers={answers} // 回答を渡す
        />
      }
    />

    {/* チャット画面 */}
    <Route
      path="/chat-screen"
      element={
        <div className="chat-container">
          <button className="home-button" onClick={() => navigate("/")}>
            <img src={home} alt="home-icon" className="home-icon" />ホームに戻る
          </button>

          <div className="chat-box">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender}`} // ボットとユーザーで異なるスタイルを適用
              >
                {/* ボットとユーザーでアイコンを切り替え */}
                {message.sender === "bot" ? (
                  <img src={ic} alt="bot-icon" className="message-icon bot-icon" />
                ) : (
                  <img src={user} alt="user-icon" className="message-icon user-icon" />
                )}

                {/* メッセージ内容 */}
                <div className="message-bubble">
                  {message.sender === "bot"
                    ? renderMessageContent(message.text) // ボットのメッセージをレンダリング
                    : <p>{message.text}</p>} {/* ユーザーメッセージをそのまま表示 */}
                </div>
              </div>
            ))}
          </div>

          {loading && <p>読み込み中...</p>}

          <div className="input-container">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="メッセージを入力..."
            />
            <button onClick={handleSendMessage}>送信</button>
          </div>
        </div>
      }
    />
    </Routes>
  );
}

export default App;