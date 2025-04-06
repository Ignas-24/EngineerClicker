import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import click1 from "../assets/click1.mp3";
import click2 from "../assets/click2.mp3";
import click3 from "../assets/click3.mp3";
import click4 from "../assets/click4.mp3";
import Console from "./console/Console.jsx";
import game from "../game/Game.js";

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
	const [consoleStyles, setConsoleStyles] = useState();

	const canvasRef = useRef(null);
	const appRef = useRef(null);
	const spriteRef = useRef(null);
	const backgroundRef = useRef(null);

	function handleClick(sprite) {
		game.resourceManager.addEuros(1);
		playClickSound();
		addText((prev) => [...prev, "test"]);
		if (onClick) onClick();
	}

	function handleResize() {
		if (!appRef.current || !spriteRef.current || !backgroundRef.current) return;

		const app = appRef.current;
		const sprite = spriteRef.current;
		const background = backgroundRef.current;

		const spriteSize = app.screen.height / 2;
		sprite.setSize(spriteSize);
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

			const [computerTexture, backgroundTexture] = await Promise.all([
				PIXI.Assets.load("src/assets/pc1.png"),
				PIXI.Assets.load("src/assets/background.png")
			]);

			const background = new PIXI.Sprite(backgroundTexture);
			backgroundRef.current = background;
			background.anchor.set(0.5);
			background.zIndex = -1;
			app.stage.addChild(background);

			const sprite = new PIXI.Sprite(computerTexture);
			spriteRef.current = sprite;
			sprite.anchor.set(0.5);
			sprite.eventMode = "static";
			sprite.cursor = "pointer";
			sprite.zIndex = 1;
			sprite.on("pointerdown", () => {
				handleClick(sprite);
			});

			app.stage.addChild(sprite);
			new ResizeObserver(handleResize).observe(canvasRef.current);

			app.ticker.add((time) => {
				const spriteBounds = sprite.getBounds(false, new PIXI.Bounds());
				const spriteWidth = spriteBounds.maxX - spriteBounds.minX;
				const spriteHeight = spriteBounds.maxY - spriteBounds.minY;
				const originalSpriteWidth = 1024;
				const originalSpriteHeight = 1024;
				const targetTopLeft = { x: 208, y: 164 };
				const targetBottomRight = { x: 815, y: 563 };

				if (spriteBounds)
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
			appRef.current?.destroy(true);
		};
	}, []);

	return (
		<div
			onResize={handleResize}
			ref={canvasRef}
			style={{ position: "relative", width: "100%", height: "100%" }}
		>
			<Console textState={text} styles={consoleStyles} />
		</div>
	);
};

export default ComputerCanvas;
