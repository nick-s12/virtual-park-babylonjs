import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, PBRMaterial, Effect, CubeTexture, Texture, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";


export class CustomModels {
    scene: Scene;
    engine: Engine;
    canvas: HTMLCanvasElement;  // Explicitly declare the canvas property

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;  // Assign the passed canvas to the class property
        this.engine = new Engine(this.canvas, true);
        this.scene = this.createScene();

        this.CreateGround();
        this.CreateBarrel();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    createScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 0.75, -8), scene);
        camera.attachControl();
        camera.speed = 0.25;

        // const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
        // hemiLight.intensity = 0;

        Effect.ResetCache();
        const envTex = CubeTexture.CreateFromPrefilteredData(`/environment/sky.env?v=${Date.now()}`, scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);
        scene.environmentIntensity = 1;

        return scene;
    }

    CreateGround(): void {
        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);
        ground.material = this.CreateAsphalt();
    }


    CreateAsphalt(): PBRMaterial {
        const pbr = new PBRMaterial("pbr", this.scene);
        pbr.albedoTexture = new Texture("/textures/asphalt/asphalt_diffuse.jpg", this.scene);

        pbr.bumpTexture = new Texture("./textures/asphalt/asphalt_normal.jpg", this.scene);

        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;

        pbr.useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true;

        pbr.metallicTexture = new Texture("./textures/asphalt/asphalt_ao_rough_metal.jpg", this.scene);

        // pbr.roughness = 1;

        return pbr;
    }

    async CreateBarrel(): Promise<void> {
        // SceneLoader.ImportMesh("", "/models/", "barrel.glb", this.scene, (meshes) => {
        //     console.log(meshes);
        // });

        const models = await SceneLoader.ImportMeshAsync("", "/models/", "barrel.glb", this.scene);

        models.meshes[0].position = new Vector3(-3, 1, 0);

        console.log("models:", models);

    }


}