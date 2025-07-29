import axios from "axios";
import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  success: false,

  login: async (credentials) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        "https://quiz-arena-core.vercel.app/auth/login",
        credentials
      );

      const { user, token } = response.data;

      // تخزين البيانات في localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({
        user: user,
        token: token,
        loading: false,
        success: true,
      });

      console.log("Logged in successfully");
    } catch (error) {
      console.log("Login error:", error);
      set({ loading: false, success: false });
    }
  },

  logout: () => {
    // حذف البيانات من localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, loading: false,
  success: false, });
  },

  // دالة لتحميل البيانات من localStorage عند تحميل التطبيق
  loadUserFromLocalStorage: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      set({ user: JSON.parse(user), token: token });
    }
  },
}));

export default useUserStore;
