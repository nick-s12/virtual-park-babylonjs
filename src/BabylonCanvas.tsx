// No need to import React for JSX transformation in React 17+
import { useEffect, useRef } from "react";
import { StandardMaterials } from "./Examples/StandardMaterials"; // Import the BasicScene class
import { BasicScene } from "./Examples/BabylonScene"; // Import the BasicScene class
import { PBR } from "./Examples/PBR"; // Import the BasicScene class
import { CustomModels } from "./Examples/CustomModels"; // Import the BasicScene class

const BabylonCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // new StandardMaterials(canvasRef.current);
            // new BasicScene(canvasRef.current);
            // new PBR(canvasRef.current);
            new CustomModels(canvasRef.current);
        }
    }, []);


    // useEffect(() => {
    //     if (!canvasRef.current) return;

    //     const pbr = new PBR(canvasRef.current);

    //     return () => {
    //         pbr.dispose(); // 💡 makes sure Babylon doesn’t reuse broken shaders
    //     };
    // }, []);

    return (
        <div style={{ width: "80%", height: "70%", margin: "0 auto", position: "relative" }}>
            <h1 style={{ textAlign: "center" }}>Park 3D</h1>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
    );
};

export default BabylonCanvas;
