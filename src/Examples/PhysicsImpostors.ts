import {
    AbstractMesh,
    CannonJSPlugin,
    Color3,
    CubeTexture,
    Engine,
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    PBRMaterial,
    PhysicsImpostor,
    Scene,
    SceneLoader,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";


export class PhysicsImpostors {
    engine: Engine;
    scene: Scene;
    canvas!: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas);
        this.scene = this.CreateScene();

        this.init();
    }


    async init() {
        await this.CreateEnvironment();   // wait until model loads

        this.CreateImpostors();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);

        const camera = new FreeCamera("camera", new Vector3(0, 10, -20), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl();
        camera.minZ = 0.5;

        scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));


        const envTex = CubeTexture.CreateFromPrefilteredData(`/environment/sky.env?v=${Date.now()}`, scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);
        scene.environmentIntensity = 0.5;

        return scene;
    }

    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Prototype_Level.glb",
            this.scene
        );

        // Remove ramp from the scene
        const rampMesh = this.scene.getMeshByName("Ramp");
        if (rampMesh) {
            rampMesh.dispose(); // completely removes it from the scene
        }

        meshes.map((mesh) => {
            console.log(mesh.name);

            mesh.checkCollisions = true;
        })
    }


    CreateImpostors(): void {
        const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
        box.position = new Vector3(0, 10, 1);
        box.rotation = new Vector3(Math.PI / 4, 0, 0);

        const boxMaterial = new PBRMaterial("boxMaterial", this.scene);
        boxMaterial.albedoColor = new Color3(0.99, 0, 0);
        boxMaterial.roughness = 0.3;
        boxMaterial.metallic = 1;
        box.material = boxMaterial;

        box.physicsImpostor = new PhysicsImpostor(
            box,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 1,
                // friction: 0,
                restitution: 0.75
            },
            this.scene
        );








        const ground = MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, this.scene);
        ground.isVisible = false;
        ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 0,
                restitution: 0.5
            },
            this.scene
        );


        // const floor = this.scene.getMeshByName("Floor") as AbstractMesh;
        // if (floor) {
        //     const floorMaterial = new PBRMaterial("floorMat", this.scene);
        //     floorMaterial.albedoColor = new Color3(0, 0, 0.99);
        //     floorMaterial.roughness = 0.5;
        //     floorMaterial.metallic = 1;
        //     floor.material = floorMaterial;
        //     floor.refreshBoundingInfo().setEnabled(true);
        //     console.log(floor.getBoundingInfo().boundingBox); // debug size

        //     floor.physicsImpostor = new PhysicsImpostor(
        //         floor,
        //         PhysicsImpostor.BoxImpostor,
        //         {
        //             mass: 0,
        //             restitution: 0.5
        //         },
        //         this.scene
        //     );
        // }




        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, this.scene);
        // sphere.position = new Vector3(-4, 6, 0)
        sphere.position = new Vector3(0, 6, 0)

        const sphereMaterial = new PBRMaterial("sphereMat", this.scene);
        sphereMaterial.albedoColor = new Color3(0, 0.8, 0);
        sphereMaterial.roughness = 0.1;
        sphere.material = sphereMaterial;


        sphere.physicsImpostor = new PhysicsImpostor(
            sphere,
            PhysicsImpostor.SphereImpostor,
            {
                mass: 1,
                restitution: 0.8,
            },
            this.scene
        );

    }
}