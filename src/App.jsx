import "./App.css";
import { MenuProvider } from "./contexts/MenuContext.jsx";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <MenuProvider>
      <Layout />
    </MenuProvider>
  );
}

export default App;
