import "./console.css";
import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { PixelateFilter } from "pixi-filters";


export default function Console( { textState, styles, onClick } ) {
  const consoleContent = useRef(null);
  const header = useRef(null);

  function handleClick(){

    if(onClick) onClick();
  }

  useEffect(() => {
    if(consoleContent.current){
      consoleContent.current.scrollTop = consoleContent.current.scrollHeight;
    }
  }, [textState])

  useEffect(() => {
    let apps = [];
  
    const createGradientCanvas = async (index, topPosition, offset1, offset2) => {
      
      if(!header.current)
      {
        return;
      }

      const app = new PIXI.Application();
  
      await app.init({
        backgroundAlpha: 0,
        resizeTo: header.current
      });
  
      const canvas = app.canvas;
      canvas.style.position = "absolute";
      canvas.style.top = `${topPosition}%`;
      canvas.style.height = "33%";
      canvas.style.width = "100%";
      //canvas.style.pointerEvents = "none";
      //canvas.style.zIndex = "-1"; 
      
      header.current.appendChild(canvas);
  
      const graphics = new PIXI.Graphics();
      graphics.rect(0, 0, app.screen.width, app.screen.height);
  
      const gradient = new PIXI.FillGradient({
        type: "linear",
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
        colorStops: [
          { offset: offset1, color: "blue" },
          { offset: offset2, color: "cyan" },
        ],
      });
  
      graphics.fill(gradient);
      graphics.alpha = 1;
  
      const pixelateFilter = new PixelateFilter(10);
      graphics.filters = [pixelateFilter];
  
      app.stage.addChild(graphics);
      apps.push(app);
    };
  
    const load = async () => {

      if (!header.current) {
        console.warn("Header not found, waiting...");
        return;
      }

      await createGradientCanvas(0, 0, 0, 1);
      await createGradientCanvas(1, 33, 0.25, 1);
      await createGradientCanvas(2, 66, 0.4, 1 );
    }; 


    const handleResize = () => {
      console.log("resize not implemented")

    };


    if (header.current) {
    load().then(() => {
      window.addEventListener("resize", handleResize);
    });
  } else {
    
    //PIXI graphics seemed to fail to load properly on page startup
    //This is an attemt to rectify it, however key issue seems to be unset console measurements, which are now set
    //This can probably be deleted
    const observer = new MutationObserver(() => {
      if (header.current) {
        observer.disconnect(); 
        load().then(() =>{
          window.addEventListener("resize", handleResize);
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
  
    return () => {
      apps.forEach((app) => app.destroy(true, true));
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  return (
    <div className="console_wrap" style={styles} onClick={handleClick}>

      <div className="console_header" ref = {header}>
        <p>MS-DOS</p>
        <div className="buttonWrapper">

          <div className="button"><p>_</p></div>
          <div className="button"><div className = "pixelIcon"><div className="middleCutOut"></div></div></div>
          <div className="button"><p>X</p></div>
        
        </div>
      </div>
      <div className="console_contents" ref = {consoleContent}>
      {textState.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
      </div>
    </div>

  );
}

