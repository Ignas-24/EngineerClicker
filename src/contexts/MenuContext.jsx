import { createContext, useContext, useState } from "react";

const MenuContext = createContext();
export function MenuProvider({ children }) {
  const [openMenu, setOpenMenu] = useState(null);
  const toggleMenu = (key) =>
    setOpenMenu((prev) => (prev === key ? null : key));
  return (
    <MenuContext.Provider value={{ openMenu, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
}
export const useMenu = () => useContext(MenuContext);
