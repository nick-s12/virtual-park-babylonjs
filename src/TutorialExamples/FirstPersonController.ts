import {
    Engine,
    FreeCamera,
    HemisphericLight,
    Scene,
    SceneLoader,
    Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class FirstPersonController {
    engine: Engine;
    scene: Scene;
    canvas!: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas);
        this.scene = this.CreateScene();

        this.CreateEnvironment();

        this.CreateController();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);

        new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);

        scene.onPointerDown = (event) => {
            // console.log(event);
            if (event.button === 0) {
                this.engine.enterPointerlock();
            }
            if (event.button === 1) {
                this.engine.exitPointerlock();
            }
        }

        const framesPerSecond = 60;
        const gravity = -9.81;
        scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
        scene.collisionsEnabled = true;


        return scene;
    }

    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Prototype_Level.glb",
            this.scene
        );

        meshes.map((mesh) => {
            // console.log(mesh.name);
            // mesh.showBoundingBox = true;
            mesh.checkCollisions = true;
        })
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
}