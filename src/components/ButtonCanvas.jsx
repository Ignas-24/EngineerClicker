import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import click1 from "../assets/click1.mp3";
import click2 from "../assets/click2.mp3";
import click3 from "../assets/click3.mp3";
import click4 from "../assets/click4.mp3";

const clickSounds = [click1, click2, click3, click4];

const playClickSound = () => {
  const randomSfx = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  const sound = new Audio(randomSfx);
  sound.playbackRate = 1 + Math.random() * 0.3;
  sound.volume = 0.05 + Math.random() * 0.02;
  sound.play();
};

const ButtonCanvas = ({ onClick }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const spriteRef = useRef(null);

  // TODO: for demo, delete later
  function createBurst(x, y) {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      let circle = new PIXI.Graphics();
      circle.circle(0, 0, 5 + Math.random() * 5).fill(0xaaaaee);
      circle.x = x;
      circle.y = y;
      circle.zIndex = -1;
      appRef.current.stage.addChild(circle);
      let deg = Math.random() * Math.PI * 2;
      let mag = 3 + Math.random() * 1;
      let vx = Math.sin(deg) * mag;
      let vy = Math.cos(deg) * mag;
      particles.push({ sprite: circle, vx, vy });
    }

    appRef.current.ticker.add(() => {
      particles.forEach((p) => {
        p.sprite.x += p.vx;
        p.sprite.y += p.vy;
        p.sprite.alpha -= 0.02;
        if (p.sprite.alpha <= 0) appRef.current.stage.removeChild(p.sprite);
      });
    });
  }

  function handleClick(sprite) {
    playClickSound();
    const clickedScale = 1.1;
    sprite.scale._x = clickedScale;
    sprite.scale._y = clickedScale;
    createBurst(sprite.position._x, sprite.position._y);
    onClick();
  }

  function handleResize() {
    if (!appRef.current) return;
    if (!spriteRef.current) return;
    const app = appRef.current;
    const sprite = spriteRef.current;
    sprite.position.set(app.screen.width / 2, app.screen.height / 2);
  }

  useEffect(() => {
    // TODO: lots of code for demo, delete later
    if (!canvasRef.current) return;
    let load = async () => {
      const app = new PIXI.Application();
      app.stage.sortableChildren = true;
      appRef.current = app;

      await app.init({ resizeTo: canvasRef.current, backgroundAlpha: 0 });
      canvasRef.current.appendChild(app.canvas);

      const texture = await PIXI.Assets.load(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Crystal_Project_computer.png/200px-Crystal_Project_computer.png"
      );

      const sprite = new PIXI.Sprite(texture);
      spriteRef.current = sprite;
      sprite.anchor.set(0.5);
      sprite.position.set(app.screen.width / 2, app.screen.height / 2);
      sprite.eventMode = "static";
      sprite.cursor = "pointer";
      sprite.on("pointerdown", () => {
        handleClick(sprite);
      });
      new ResizeObserver(handleResize).observe(canvasRef.current);

      app.stage.addChild(sprite);
      app.ticker.add((time) => {
        const sprite = spriteRef.current;
        const eps = 1e-2;
        const targetScale = 1;
        if (Math.abs(sprite.scale._x - targetScale) < eps) {
          sprite.scale.set(targetScale, targetScale);
        } else {
          let scaleSpeed = 0.2;
          let newScale =
            sprite.scale._x *
            ((targetScale / sprite.scale._x - 1) * scaleSpeed * time.deltaTime +
              1);
          sprite.scale.set(newScale);
        }
      });
    };

    load();

    return () => {
      appRef.current.destroy(true);
    };
  }, []);

  return (
    <div
      onResize={handleResize}
      ref={canvasRef}
    ></div>
  );
};

export default ButtonCanvas;
