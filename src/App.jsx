import "./App.css";
import ButtonCanvas from "./components/ButtonCanvas";
import game from "./game/Game";
import { useSyncExternalStore } from "react";

function App() {
  const euros = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.euro
  );

  const handleClick = () => {
    game.resourceManager.addEuros(1);
  };

  return (
    <>
      <div style={{ fontSize: "2rem" }}>Money: €{euros}</div>
      <div>
        <ButtonCanvas onClick={handleClick} />
      </div>
    </>
  );
}

export default App;
