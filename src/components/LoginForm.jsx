import { useState } from "react";
import useAuth from "../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email.trim(), password);
      // После успешного логина useAuth обновит isAuth
    } catch (err) {
  console.error("Login error:", err);
  if (err.response) {
    console.error("Response data:", err.response.data);
    console.error("Response status:", err.response.status);
    if (err.response.status === 401) {
      setError("Неверный логин или пароль");
    } else {
      setError("Ошибка входа. Попробуйте снова.");
    }
  } else if (err.request) {
    setError("Сервер не отвечает. Проверьте соединение.");
  } else {
    setError("Ошибка входа. Попробуйте снова.");
  }
}

  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: "auto" }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <button type="submit" style={{ width: "100%", padding: 10 }}>
        Войти
      </button>
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
