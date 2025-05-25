import * as PIXI from "pixi.js";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import click1 from "../assets/click1.mp3";
import click2 from "../assets/click2.mp3";
import click3 from "../assets/click3.mp3";
import click4 from "../assets/click4.mp3";
import Console from "./console/Console.jsx";
import game from "../game/Game.js";
import pc1Image from "../assets/pc1.png";
import pcFrame1 from "../assets/pc_mult_frame1.png";
import pcFrame2 from "../assets/pc_mult_frame2.png";
import pcFrame3 from "../assets/pc_mult_frame3.png";
import pcFrame4 from "../assets/pc_mult_frame4.png";
import pcFrame5 from "../assets/pc_mult_frame5.png";
import pcFrame6 from "../assets/pc_mult_frame6.png";
import pcFrame7 from "../assets/pc_mult_frame7.png";
import pcFrame8 from "../assets/pc_mult_frame8.png";
import pcSpaceFrame from "../assets/pc_space_frame.png";

const clickSounds = [click1, click2, click3, click4];

const animationFrames = [
  pcFrame1,
  pcFrame2,
  pcSpaceFrame,
  pcFrame3,
  pcSpaceFrame,
  pcFrame4,
  pcFrame5,
  pcSpaceFrame,
  pcFrame6,
  pcFrame7,
  pcSpaceFrame,
  pcFrame8,
  pcSpaceFrame,
];

const playClickSound = () => {
  const randomSfx = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  const sound = new Audio(randomSfx);
  sound.playbackRate = 1 + Math.random() * 0.3;
  sound.volume = 0.05 + Math.random() * 0.02;
  sound.play();
};

const ComputerCanvas = ({ onClick }) => {
  const [text, addText] = useState([]);
  const [, setCurrentString] = useState("");
  const [consoleStyles, setConsoleStyles] = useState();
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const spriteRef = useRef(null);
  const animatedSpriteRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const isActiveProject = useSyncExternalStore(game.subscribe.bind(game), () =>
    game.project?.isActive(),
  );
  const handleClick = useCallback(() => {
    console.log("CLICKKKK");
    const app = appRef.current;
    const sprite = spriteRef.current;
    const animatedSprite = animatedSpriteRef.current;
    if (!app) return;
    if (!sprite) return;
    if (!animatedSprite) return;
    if (isActiveProject) {
      game.project.addProgress();
    } else {
      game.resourceManager.addEurosClicked();
    }
    playClickSound();

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animatedSprite.visible = true;
    sprite.visible = false;
    animatedSprite.play();
    sprite.setSize((app.screen.height / 2) * 1.42);
    animatedSprite.setSize((app.screen.height / 2) * 1.42);

    animationTimeoutRef.current = setTimeout(() => {
      animatedSprite.visible = false;
      sprite.visible = true;
      animatedSprite.gotoAndStop(animatedSprite.currentFrame);
      console.log("stop");
      animationTimeoutRef.current = null;
    }, 250);

    setCurrentString((previousString) => {
      let newString = previousString;
      if (newString === "") {
        newString =
          "\n" +
          Array.from({ length: Math.floor(Math.random() * 20) + 1 }, () => {
            const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\"',.;:?!";
            return charset[Math.floor(Math.random() * charset.length)];
          }).join("");
      }

      let len = Math.min(
        Math.ceil(Math.sqrt(Math.random() * 5) + 1),
        newString.length,
      );
      let output = newString.slice(0, len);
      newString = newString.slice(len);
      let newLine = false;
      if (output[0] === "\n") {
        newLine = true;
      }
      addText((prevText) => {
        let updatedText;
        if (newLine) {
          updatedText = [...prevText, "\n", output];
        } else {
          const lastLine = prevText[prevText.length - 1] || "";
          updatedText = [...prevText.slice(0, -1), lastLine + output];
        }

        return updatedText.slice(-10); // keep the last 10 lines in memory
      });
      return newString;
    });

    if (onClick) onClick();
  }, [isActiveProject]);
  function handleResize() {
    if (!appRef.current) return;
    if (!spriteRef.current) return;
    const app = appRef.current;
    const sprite = spriteRef.current;
    const animatedSprite = animatedSpriteRef.current;

    sprite.setSize((app.screen.height / 2) * 1.4);
    sprite.position.set(app.screen.width / 2, app.screen.height / 2);

    animatedSprite.setSize((app.screen.height / 2) * 1.4);
    animatedSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    let load = async () => {
      const app = new PIXI.Application();
      app.stage.sortableChildren = true;
      appRef.current = app;
      await app.init({ resizeTo: canvasRef.current, backgroundAlpha: 0 });
      canvasRef.current.appendChild(app.canvas);

      const [texture, ...animationTextures] = await Promise.all([
        PIXI.Assets.load(pc1Image),
        ...animationFrames.map((frame) => PIXI.Assets.load(frame)),
      ]);

      const sprite = new PIXI.Sprite(texture);
      spriteRef.current = sprite;
      sprite.setSize((app.screen.height / 2) * 1.4);
      sprite.anchor.set(0.5);
      sprite.position.set(app.screen.width / 2, app.screen.height / 2);
      sprite.eventMode = "static";
      sprite.cursor = "var(--nes-cursor-select)";
      sprite.on("pointerdown", () => {
        handleClick();
      });

      const animatedSprite = new PIXI.AnimatedSprite(animationTextures);
      animatedSpriteRef.current = animatedSprite;
      animatedSprite.setSize((app.screen.height / 2) * 1.4);
      animatedSprite.anchor.set(0.5);
      animatedSprite.position.set(app.screen.width / 2, app.screen.height / 2);
      animatedSprite.eventMode = "static";
      animatedSprite.cursor = "var(--nes-cursor-select)";
      animatedSprite.animationSpeed = 0.2;
      animatedSprite.loop = true;
      animatedSprite.visible = false;
      animatedSprite.on("pointerdown", () => {
        handleClick();
      });

      new ResizeObserver(handleResize).observe(canvasRef.current);

      app.stage.addChild(sprite);
      app.stage.addChild(animatedSprite);
      app.ticker.add((time) => {
        const EPS = 1e-3;
        const targetSize = (app.screen.height / 2) * 1.4;
        if (Math.abs(sprite.getSize().width - targetSize) > EPS) {
          const targetTimeMS = 200;
          const alpha = Math.sqrt(time.elapsedMS / targetTimeMS);
          const newSize =
            Math.min(1, alpha) * targetSize +
            Math.max(0, 1 - alpha) * sprite.getSize().width;
          sprite.setSize(newSize);
          animatedSprite.setSize(newSize);
        }

        const spriteBounds = sprite.visible
          ? sprite.getBounds(false, new PIXI.Bounds())
          : animatedSprite.getBounds(false, new PIXI.Bounds());
        const spriteWidth = spriteBounds.maxX - spriteBounds.minX;
        const spriteHeight = spriteBounds.maxY - spriteBounds.minY;
        const originalSpriteWidth = 1024;
        const originalSpriteHeight = 1024;
        const targetTopLeft = { x: 205, y: 160 };
        const targetBottomRight = { x: 816, y: 564 };

        if (spriteBounds)
          // TODO: This causes 100s of rerenders per second
          setConsoleStyles({
            left: Math.floor(
              spriteBounds.minX +
                targetTopLeft.x * (spriteWidth / originalSpriteWidth),
            ),
            top: Math.floor(
              spriteBounds.minY +
                targetTopLeft.y * (spriteHeight / originalSpriteHeight),
            ),
            width: Math.ceil(
              (targetBottomRight.x - targetTopLeft.x + 1) *
                (spriteWidth / originalSpriteWidth),
            ),
            height:
              Math.ceil(
                (targetBottomRight.y - targetTopLeft.y + 1) *
                  (spriteHeight / originalSpriteHeight),
              ) + 1,
          });
      });
    };

    load();

    return () => {
      appRef.current.destroy(true);
    };
  }, []);

  useEffect(() => {
    const sprite = spriteRef.current;
    const animatedSprite = animatedSpriteRef.current;
    if (!sprite) return;
    if (!animatedSprite) return;
    sprite.removeAllListeners("pointerdown");
    sprite.on("pointerdown", () => {
      handleClick();
    });
    animatedSprite.removeAllListeners("pointerdown");
    animatedSprite.on("pointerdown", () => {
      handleClick();
    });
  }, [isActiveProject]);

  return (
    <div
      onResize={handleResize}
      ref={canvasRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Console textState={text} styles={consoleStyles} onClick={handleClick} />
    </div>
  );
};
export default ComputerCanvas;
