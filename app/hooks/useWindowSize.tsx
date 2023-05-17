import { useState, useEffect } from "react";
const getSize = () => {
  return {
    innerHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    innerWidth: typeof window !== "undefined" ? window.innerWidth : 0,
  };
};

const useWindowSize = (): { innerHeight: number; innerWidth: number } => {
  let [windowSize, setWindowSize] = useState(getSize());
  const handleResize = () => {
    setWindowSize(getSize());
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

export default useWindowSize;
