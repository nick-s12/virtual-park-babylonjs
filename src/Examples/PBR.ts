import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, CubeTexture, Effect, PBRMaterial, Texture } from "@babylonjs/core";

export class PBR {
    scene: Scene;
    engine: Engine;
    canvas: HTMLCanvasElement;  // Explicitly declare the canvas property

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;  // Assign the passed canvas to the class property
        this.engine = new Engine(this.canvas, true);
        this.scene = this.createScene();

        this.CreateEnvironment();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    createScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 1, -10), scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0;

        Effect.ResetCache();
        const envTex = CubeTexture.CreateFromPrefilteredData(`/environment/sky.env?v=${Date.now()}`, scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);



        // scene.environmentIntensity = 0.25;


        // envTex.onLoadObservable.add(() => {
        //     console.log("Env texture ready:", envTex.isReady());
        // });



        return scene;
    }

    CreateEnvironment(): void {
        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);
        const ball = MeshBuilder.CreateSphere("ball", { diameter: 2 }, this.scene);
        ball.position = new Vector3(0, 1, 0);

        ground.material = this.CreateAsphalt();
        ball.material = this.CreateMagic();
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


    CreateMagic(): PBRMaterial {
        const pbr = new PBRMaterial("pbr", this.scene);

        pbr.roughness = 1;

        pbr.environmentIntensity = 0.95;

        return pbr;
    }




    dispose() {
        this.scene.dispose();   // clears materials, textures, etc
        this.engine.dispose();  // clears GPU programs + context
    }



}
