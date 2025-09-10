import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    SceneLoader,
    Effect,
    CubeTexture
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class LoadingScreen {
    scene: Scene;
    engine: Engine;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;  // Assign the passed canvas to the class property
        this.engine = new Engine(this.canvas, true);

        this.scene = this.CreateScene();

        this.CreateEnvironment();

        this.engine.displayLoadingUI();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 0.75, -8), scene);

        camera.attachControl();
        camera.speed = 0.2;

        Effect.ResetCache();
        const envTex = CubeTexture.CreateFromPrefilteredData(`/environment/sky.env?v=${Date.now()}`, scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);
        scene.environmentIntensity = 0.5;


        return scene;
    }

    async CreateEnvironment(): Promise<void> {
        await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "LightingScene.glb"
        );

        this.engine.hideLoadingUI();
    }
}