"use client";
import { useEffect , useState } from "react";
import useUserStore from "../../store/userStore";

export default function ClientWrapper({ children }) {
  const loadUser = useUserStore((state) => state.loadUserFromLocalStorage);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadUser();
    setHydrated(true);
  }, [loadUser]);

  if (!hydrated) return null; 

  return <>{children}</>;
}
