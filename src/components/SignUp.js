import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LogIn.css";
import ic from "../image/ic.png";

const SignUp = () => {
  const [email, setEmail] = useState(""); // Emailの状態
  const [password, setPassword] = useState(""); // パスワードの状態
  const [fullName, setFullName] = useState(""); // フルネームの状態
  const [isFormValid, setIsFormValid] = useState(false); // フォームの有効性

  // 入力変更時にフォームの有効性を確認
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 状態を更新
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "fullName") setFullName(value);

    // 入力の有効性をチェック
    setIsFormValid(
      email.trim() !== "" &&
        password.trim() !== "" &&
        fullName.trim() !== "" &&
        (name === "email"
          ? value.trim() !== "" && password.trim() !== "" && fullName.trim() !== ""
          : true)
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="logo-text">
          <img src={ic} alt="ic" className="ic" />Isee.
        </h1>
        <h2 className="title-text">ユーザー登録</h2>

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

        {/* フルネーム入力 */}
        <input
          type="text"
          name="fullName"
          placeholder="氏名"
          className="input"
          value={fullName}
          onChange={handleInputChange}
        />

        {/* サインアップボタン */}
        <p>
          {isFormValid ? (
            <Link to="/questionnaire">
              <button className="login-button">ユーザー登録</button>
            </Link>
          ) : (
            <button className="login-button" disabled>
              はじめる
            </button>
          )}
        </p>

        {/* ログインページリンク */}
        <p>
          <Link to="/login">登録済みの方はこちら</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
