import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import css from "./LoginPage.module.css";
import { Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const [e, setE] = useState("");
  const [p, setP] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { login } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage(null); // сброс ошибки перед новым запросом
    try {
      await login(e, p);
      toast.success("Вы успешно вошли в систему!");
      window.location.href = "/";
    } catch (error) {
      // Если есть ответ от сервера — возьмём сообщение из него
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Ошибка входа. Попробуйте снова.");
      }
      toast.error("Ошибка входа. Попробуйте снова.");
    }
  };

  return (
    <div className={css.wrapper}>
      <div className={css.left}>
        <Typography variant="h4">Авторизация c Email и Пароль</Typography>
        <form onSubmit={submit}>
          <TextField
            value={e}
            onChange={(e) => setE(e.target.value)}
            id="email-input"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            value={p}
            onChange={(e) => setP(e.target.value)}
            id="password-input"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
          />
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <Button type="submit" variant="contained" sx={{ height: 60, marginTop: 2 }}>
            Войти
          </Button>
        </form>
      </div>
      <div className={css.right} />
    </div>
  );
}

export default LoginPage;
