"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useUserStore from "../../../../store/userStore";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    userName: "baraali",
    password: "Bar12345678",
  });

  const { user , token, login, loading, success } = useUserStore();

  const handleLogin = (e) => {
    e.preventDefault();
    login(credentials);
  };

  useEffect(() => {
    if (success) {
      router.push("/home");
    }
  }, [success, router]);

  useEffect(() => {
    if (user && token) {
      router.push("/home");
    }
  }, [user , token ,router]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.title}>تسجيل الدخول</h2>
        <input
          type="text"
          placeholder="اسم المستخدم"
          className={styles.input}
          value={credentials.userName}
          onChange={(e) =>
            setCredentials({ ...credentials, userName: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className={styles.input}
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? (
            <span className={styles.loader}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </span>
          ) : (
            "دخول"
          )}
        </button>
      </form>
    </div>
  );
}
