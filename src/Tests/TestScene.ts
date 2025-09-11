import {
    CubeTexture,
    Engine,
    FreeCamera,
    HemisphericLight,
    Scene,
    SceneLoader,
    Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class TestScene {
    private engine: Engine;
    private scene: Scene;
    private canvas!: HTMLCanvasElement;
    private handleResize: () => void;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas);
        this.scene = this.CreateScene();
        this.engine.displayLoadingUI();

        this.CreateSkybox();

        this.CreateEnvironment();

        this.CreateController();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        this.handleResize = () => this.engine.resize();
        window.addEventListener("resize", this.handleResize);
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        // new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);

        scene.onPointerDown = (event) => {
            if (event.button === 0) this.engine.enterPointerlock();
            if (event.button === 1) this.engine.exitPointerlock();
        }

        const framesPerSecond = 60;
        const gravity = -9.81;
        scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
        scene.collisionsEnabled = true;

        return scene;
    }


    CreateSkybox(): void {
        const envTex = CubeTexture.CreateFromPrefilteredData(
            "./environment/park.env",
            this.scene
        );
        envTex.gammaSpace = false;
        envTex.rotationY = Math.PI;
        this.scene.environmentTexture = envTex;
        this.scene.createDefaultSkybox(envTex, true, 2000, 0.1);
        this.scene.environmentIntensity = 0.7;
    }


    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Prototype_Level.glb",
            this.scene
        );

        meshes.map((mesh) => {
            // mesh.isVisible = false;
            mesh.checkCollisions = true;
        })

        this.engine.hideLoadingUI();
    }


    CreateController(): void {
        const camera = new FreeCamera("camera", new Vector3(0, 10, 0), this.scene);
        camera.attachControl(this.canvas, true);

        camera.applyGravity = true;
        camera.checkCollisions = true;

        camera.ellipsoid = new Vector3(1, 1, 1)

        camera.minZ = 0.4;
        camera.speed = 0.7;
        camera.angularSensibility = 4000;

        camera.keysUp.push(87);
        camera.keysLeft.push(65);
        camera.keysDown.push(83);
        camera.keysRight.push(68);
    }


    dispose() {
        window.removeEventListener("resize", this.handleResize); // stop listening
        this.scene.dispose();  // free all meshes, lights, materials in the scene
        this.engine.dispose(); // release WebGL resources tied to the canvas
    }
}