import * as PIXI from "pixi.js";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import click1 from "../assets/click1.mp3";
import click2 from "../assets/click2.mp3";
import click3 from "../assets/click3.mp3";
import click4 from "../assets/click4.mp3";
import Console from "./console/Console.jsx";
import game from "../game/Game.js";
import pc1Image from "../assets/pc1.png"
import backgroundImage from "../assets/background.png"

const clickSounds = [click1, click2, click3, click4];

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
    const backgroundRef = useRef(null);
    const isActiveProject = useSyncExternalStore(game.subscribe.bind(game), () => game.project?.isActive());
        
    const handleClick = useCallback((sprite) => {
        if (isActiveProject) {
            game.project.addProgress();
        }
        else {
            game.resourceManager.addEurosClicked();
        }
        playClickSound();
        setCurrentString((previousString) => {
            let newString = previousString;
            if (newString === "") {
                newString = "\n" + Array.from(
                    { length: Math.floor(Math.random() * 20) + 1 },
                    () => {
                        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\"',.;:?!";
                        return charset[Math.floor(Math.random() * charset.length)];
                    }
                ).join("");
            }

            let len = Math.min(Math.ceil(Math.sqrt(Math.random() * 5)+1), newString.length);
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
        const background = backgroundRef.current;
        sprite.setSize(app.screen.height / 2 * 1.4);
        sprite.position.set(app.screen.width / 2, app.screen.height / 2);

        background.width = app.screen.width;
        background.height = app.screen.height;
        background.position.set(
            app.screen.width / 2,
            app.screen.height / 2
        );
    }

    useEffect(() => {
        if (!canvasRef.current) return;
        let load = async () => {
            const app = new PIXI.Application();
            app.stage.sortableChildren = true;
            appRef.current = app;

            await app.init({ resizeTo: canvasRef.current, backgroundAlpha: 0 });
            canvasRef.current.appendChild(app.canvas);

            const [texture, backgroundTexture] = await Promise.all([
                PIXI.Assets.load(pc1Image),
                PIXI.Assets.load(backgroundImage)
            ]);

            const background = new PIXI.Sprite(backgroundTexture);
            backgroundRef.current = background;
            background.anchor.set(0.5);
            background.zIndex = -1;
            app.stage.addChild(background);

            const sprite = new PIXI.Sprite(texture);
            spriteRef.current = sprite;
            sprite.setSize(app.screen.height / 2 * 1.4);
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
                const spriteBounds = sprite.getBounds(false, new PIXI.Bounds());
                const spriteWidth = spriteBounds.maxX - spriteBounds.minX;
                const spriteHeight = spriteBounds.maxY - spriteBounds.minY;
                const originalSpriteWidth = 1024;
                const originalSpriteHeight = 1024;
                const targetTopLeft = { x: 208, y: 164 };
                const targetBottomRight = { x: 815, y: 563 };

                if (spriteBounds)
                    // TODO: This causes 100s of rerenders per second
                    setConsoleStyles({
                        left: Math.floor(
                            spriteBounds.minX +
                            targetTopLeft.x * (spriteWidth / originalSpriteWidth)
                        ),
                        top: Math.floor(
                            spriteBounds.minY +
                            targetTopLeft.y * (spriteHeight / originalSpriteHeight)
                        ),
                        width: Math.ceil(
                            (targetBottomRight.x - targetTopLeft.x + 1) *
                            (spriteWidth / originalSpriteWidth)
                        ),
                        height:
                            Math.ceil(
                                (targetBottomRight.y - targetTopLeft.y + 1) *
                                (spriteHeight / originalSpriteHeight)
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
        if(!sprite) return;
        sprite.removeAllListeners("pointerdown");
        sprite.on("pointerdown", () => {
            handleClick(sprite);
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
