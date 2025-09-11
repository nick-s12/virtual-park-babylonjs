// No need to import React for JSX transformation in React 17+
import { useEffect, useRef } from "react";
import { StandardMaterials } from "../TutorialExamples/StandardMaterials";
import { BasicScene } from "../TutorialExamples/BabylonScene";
import { PBR } from "../TutorialExamples/PBR";
import { CustomModels } from "../TutorialExamples/CustomModels";
import { LightsShadows } from "../TutorialExamples/LightsShadows";
import { LoadingScreen } from "../TutorialExamples/LoadingScreen";
import { CameraDemo } from "../TutorialExamples/CameraDemo";
import { MeshActions } from "../TutorialExamples/MeshActions";
import { FirstPersonController } from "../TutorialExamples/FirstPersonController";
import { PhysicsImpostors } from "../TutorialExamples/PhysicsImpostors";

const TutorialBabylon: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let scene: any;

        if (canvasRef.current) {
            // new StandardMaterials(canvasRef.current);
            // new BasicScene(canvasRef.current);
            // new PBR(canvasRef.current);
            // new CustomModels(canvasRef.current);
            // new LightsShadows(canvasRef.current);
            // new LoadingScreen(canvasRef.current);
            // new CameraDemo(canvasRef.current);
            // new MeshActions(canvasRef.current);
            // new FirstPersonController(canvasRef.current);
            scene = new PhysicsImpostors(canvasRef.current);
        }

        return () => {
            scene?.dispose();
        };
    }, []);

    return (
        <div style={{ width: "80%", height: "70%", margin: "0 auto", position: "relative" }}>
            <h1 style={{ textAlign: "center" }}>Tutorials Babylon</h1>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
    );
};

export default TutorialBabylon;
