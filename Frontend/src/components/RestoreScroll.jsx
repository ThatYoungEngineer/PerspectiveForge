import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RestoreScroll() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}