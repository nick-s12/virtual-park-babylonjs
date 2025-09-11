import { useEffect, useRef } from "react";
import { TestScene } from "../Tests/TestScene";

const TestBabylon: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let scene: any;
        if (canvasRef.current) {
            scene = new TestScene(canvasRef.current);
        }
        return () => {
            scene?.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100vw",
                height: "100vh",
                display: "block",
                border: "none",
                outline: "none",
            }}
        ></canvas>
    );
};

export default TestBabylon;
