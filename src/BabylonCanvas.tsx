import React, { useEffect, useRef } from "react";
import { BasicScene } from "./Examples/BabylonScene"; // Import the BasicScene class

const BabylonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      new BasicScene(canvasRef.current);
    }
  }, []);

  return (
    <div style={{ width: "80%", height: "70%", margin: "0 auto", position: "relative" }}>
      <h1 style={{ textAlign: "center" }}>Park 3D</h1>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>
    </div>
  );
};

export default BabylonCanvas;
