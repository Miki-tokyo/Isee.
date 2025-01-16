import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LogIn.css";
import ic from "../image/ic.png";

const LogIn = () => {
  const [email, setEmail] = useState(""); // Emailの状態
  const [password, setPassword] = useState(""); // パスワードの状態
  const [isFormValid, setIsFormValid] = useState(false); // フォームの有効性

  // 入力変更時にフォームの有効性を確認
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    // 両方の入力が有効か確認
    setIsFormValid(
      value.trim() !== "" && (name === "email" ? password : email).trim() !== ""
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="logo-text">
          <img src={ic} alt="ic" className="ic" />Isee.
        </h1>
        <h2 className="title-text">ログイン</h2>

        {/* Email入力 */}
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          className="input"
          value={email}
          onChange={handleInputChange}
        />

        {/* パスワード入力 */}
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          className="input"
          value={password}
          onChange={handleInputChange}
        />

        {/* ログインボタン */}
        <p>
          {isFormValid ? (
            <Link to="/questionnaire">
              <button className="login-button">Log In</button>
            </Link>
          ) : (
            <button className="login-button" disabled>
              はじめる
            </button>
          )}
        </p>

        {/* サインアップリンク */}
        <p>
          <Link to="/signup">ユーザー登録</Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
