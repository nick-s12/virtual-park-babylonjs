import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    SceneLoader,
    AbstractMesh,
    GlowLayer,
    LightGizmo,
    GizmoManager,
    Light,
    Color3,
    DirectionalLight,
    PointLight,
    SpotLight,
    ShadowGenerator,
    Effect,
    CubeTexture,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class LightsShadows {
    scene: Scene;
    engine: Engine;
    canvas: HTMLCanvasElement;  // Explicitly declare the canvas property
    lightTubes!: AbstractMesh[];
    models!: AbstractMesh[];
    ball!: AbstractMesh;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;  // Assign the passed canvas to the class property
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateEnvironment();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        // const camera = new FreeCamera("camera", new Vector3(3, 2, -2), this.scene);
        const camera = new FreeCamera("camera", new Vector3(0, 0.75, -8), scene);
        camera.attachControl();
        camera.speed = 0.2;


        return scene;
    }

    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "LightingScene.glb"
        );

        this.models = meshes;

        this.lightTubes = meshes.filter(
            (mesh) =>
                mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
        );

        this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
        this.ball.position = new Vector3(0, 1, -1);

        const glowLayer = new GlowLayer("glowLayer", this.scene);
        glowLayer.intensity = 0.75;

        this.CreateLights();
    }

    CreateLights(): void {
        // const hemiLight = new HemisphericLight(
        //     "hemiLight",
        //     new Vector3(0, 1, 0),
        //     this.scene
        // );

        // hemiLight.intensity = 1.0;

        // hemiLight.diffuse = new Color3(1, 0, 0);
        // hemiLight.groundColor = new Color3(0, 0, 1);
        // hemiLight.specular = new Color3(0, 1, 0);






        // const directionalLight = new DirectionalLight(
        //     "directionalLight",
        //     new Vector3(0, -1, 0),
        //     this.scene
        // );
        // directionalLight.intensity = 3.0;







        const pointLight = new PointLight(
            "pointLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        // this.CreateGizmos(pointLight);

        pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255);
        pointLight.intensity = 0.25;

        const pointClone = pointLight.clone("pointClone") as PointLight;

        pointLight.parent = this.lightTubes[0];
        pointClone.parent = this.lightTubes[1];









        const spotLight = new SpotLight(
            "spotLight",
            new Vector3(0, 1, -3),
            new Vector3(0, 0, 3),
            Math.PI / 2,
            10,
            this.scene
        );

        this.CreateGizmos(spotLight);


        spotLight.intensity = 50;

        spotLight.shadowEnabled = true;
        spotLight.shadowMinZ = 0.1;
        spotLight.shadowMaxZ = 20;

        const shadowGen = new ShadowGenerator(2048, spotLight);
        shadowGen.useBlurCloseExponentialShadowMap = true;


        this.ball.receiveShadows = true;
        shadowGen.addShadowCaster(this.ball);

        this.models.map((mesh) => {
            mesh.receiveShadows = true;
            shadowGen.addShadowCaster(mesh);
        });

        // this.CreateGizmos(spotLight);
    }

    CreateGizmos(customLight: Light): void {
        const lightGizmo = new LightGizmo();
        lightGizmo.scaleRatio = 1;
        lightGizmo.light = customLight;

        const gizmoManager = new GizmoManager(this.scene);
        gizmoManager.positionGizmoEnabled = true;
        gizmoManager.rotationGizmoEnabled = true;
        gizmoManager.usePointerToAttachGizmos = false;
        gizmoManager.attachToMesh(lightGizmo.attachedMesh);
    }
}