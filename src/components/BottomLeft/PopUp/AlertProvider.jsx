import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AlertPopUp from "./AlertPopUp";

const AlertContext = createContext(null);
export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [message, setMessage] = useState("");

  const show = useCallback((msg) => {
    let resolver = null;
    setMessage(msg);
    return new Promise((resolve) => (resolver = resolve));
  }, []);

  const hide = useCallback(() => {
    setMessage("");
  }, []);

  useEffect(() => {
    const originalAlert = window.alert;

    window.alert = (msg = "") => {
      return show(String(msg));
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [show]);

  return (
    <AlertContext.Provider value={{ show }}>
      {children}
      <AlertPopUp message={message} onClose={hide} />
    </AlertContext.Provider>
  );
}
