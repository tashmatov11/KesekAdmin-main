// useAuth.js
import { useEffect, useState } from "react";
import $api from "../http/Api";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [isAuth, setAuth] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isGid, setGid] = useState(false);

  const navigate = useNavigate();

  const getUser = async (uid) => {
    try {
      const response = await $api.get(`/user/${uid}`);
      const userData = response.data;

      if (userData.role === "gid") {
        setGid(true);
      } else if (userData.role === "user") {
        // alert("Can't get access to admin panel");
        // setLoading(false);
        // window.location.href = "/404";
        navigate("/404");
      }

      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminKey");
    setAuth(false);
  };

 const login = async (email, password) => {
  try {
    const res = await $api.post("user/auth", {
      email,
      password,
    });

    localStorage.setItem("adminKey", res.data.id);
    setAuth(true);
    return res.data;
  } catch (error) {
    if (error.response) {
      // Ошибка от сервера (например, 400)
      console.error("Ошибка от сервера:", error.response.data);
    } else if (error.request) {
      // Запрос был сделан, но ответа не получили
      console.error("Нет ответа от сервера:", error.request);
    } else {
      // Ошибка в настройке запроса
      console.error("Ошибка настройки запроса:", error.message);
    }
    throw error;
  }
};


  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const id = localStorage.getItem("adminKey");
        if (id) {
          const userExist = await getUser(id);
          if (userExist) {
            setAuth(true);
            setAuthData(userExist);
            setLoading(false);
          } else {
            logout();
          }
        } else {
          setAuth(false);
          setAuthData(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  return { isAuth, isGid, authData, isLoading, login, logout };
};

export default useAuth;
