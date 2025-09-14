import {
    CannonJSPlugin,
    Color3,
    CubeTexture,
    Engine,
    FreeCamera,
    MeshBuilder,
    PBRMaterial,
    PhysicsImpostor,
    Scene,
    SceneLoader,
    Vector3,
    PhysicsViewer
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

export class TestScene {
    private engine: Engine;
    private scene: Scene;
    private canvas!: HTMLCanvasElement;
    private handleResize: () => void;
    private physicsViewer: PhysicsViewer;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas);
        this.engine.displayLoadingUI();

        this.scene = this.CreateScene();

        this.physicsViewer = new PhysicsViewer(this.scene);

        this.CreateSkybox();

        this.CreateEnvironment();

        this.CreateRamp();

        this.CreateController();

        this.CreateImpostors();

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

        // scene.gravity = new Vector3(0, -0.05, 0);


        scene.collisionsEnabled = true;

        scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));


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
            mesh.checkCollisions = true;



            // if (!(mesh instanceof Mesh)) {
            //     console.log("not a mesh:", mesh.name);
            // } else {
            //     console.log("a mesh:", mesh.name);
            // }


            if (mesh.name === "Ramp") {
                // mesh.isVisible = false;
                // mesh.showBoundingBox = true;
                console.log(mesh.name);

                mesh.dispose();

                // mesh.physicsImpostor = new PhysicsImpostor(
                //     mesh,
                //     PhysicsImpostor.MeshImpostor,   // <- matches the real slope
                //     { mass: 0, friction: 5, restitution: 0 },
                //     this.scene
                // );

                // this.physicsViewer.showImpostor(mesh.physicsImpostor);
            }
        })

        this.engine.hideLoadingUI();
    }


    CreateRamp(): void {
        const width = 10;   // X
        const depth = 10;   // Z
        const height = 5;   // Y

        const ramp = MeshBuilder.CreatePolyhedron("ramp", {
            custom: {
                // Vertices of wedge
                vertex: [
                    [0, 0, 0],        // 0 bottom-front-left
                    [width, 0, 0],    // 1 bottom-front-right
                    [width, 0, depth],// 2 bottom-back-right
                    [0, 0, depth],    // 3 bottom-back-left
                    [0, height, 0],   // 4 top-front-left (low edge)
                    [width, height, 0]// 5 top-front-right (low edge)
                ],
                // Faces (triangles)
                face: [
                    [0, 1, 2, 3],  // bottom
                    [0, 4, 5, 1],  // front slope
                    [1, 5, 2],     // right side
                    [0, 3, 4],     // left side
                    [3, 2, 5, 4]   // back vertical face
                ]
            }
        }, this.scene);

        const rampMaterial = new PBRMaterial("rampMaterial", this.scene);
        rampMaterial.albedoColor = new Color3(0.5, 0.5, 0.5);
        rampMaterial.roughness = 0.6;
        rampMaterial.metallic = 0.2;
        ramp.material = rampMaterial;

        ramp.position = new Vector3(-5, -1, -5);

        ramp.physicsImpostor = new PhysicsImpostor(
            ramp,
            PhysicsImpostor.MeshImpostor,  // accurate for slope
            { mass: 0, friction: 5, restitution: 0 },
            this.scene
        );
        this.physicsViewer.showImpostor(ramp.physicsImpostor);

        ramp.checkCollisions = true;






        const ramp2 = MeshBuilder.CreateBox("ramp", { width: 10, depth: 5, height: 1 }, this.scene);
        ramp2.checkCollisions = true;
        ramp2.rotation.z = Math.PI / 8; // 45° slope
        // ramp.position.y = 2.5;

        const rampMaterial2 = new PBRMaterial("rampMaterial", this.scene);
        rampMaterial2.albedoColor = new Color3(0.5, 0.5, 0.5);
        rampMaterial2.roughness = 0.6;
        rampMaterial2.metallic = 0.2;
        ramp2.material = rampMaterial2;

        ramp2.position = new Vector3(-8, 1, -5);

        ramp2.physicsImpostor = new PhysicsImpostor(
            ramp2,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 100, restitution: 0 },
            this.scene
        );





    }


    CreateController(): void {
        const camera = new FreeCamera("camera", new Vector3(0, 20, -20), this.scene);
        camera.rotation = new Vector3(Math.PI / 6, 0, 0);
        camera.attachControl(this.canvas, true);

        camera.applyGravity = true;
        camera.checkCollisions = true;
        camera.ellipsoid = new Vector3(1, 1, 1);
        // let the camera "stick" better to surfaces
        // (camera as any)._needMoveForGravity = false;




        camera.minZ = 0.2;
        camera.speed = 0.7;
        camera.angularSensibility = 4000;

        camera.keysUp.push(87);
        camera.keysLeft.push(65);
        camera.keysDown.push(83);
        camera.keysRight.push(68);
    }




    CreateImpostors(): void {
        // const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
        // ground.position = new Vector3(0, 1, 0);
        // // ground.isVisible = false;
        // ground.physicsImpostor = new PhysicsImpostor(
        //     ground,
        //     PhysicsImpostor.BoxImpostor,
        //     {
        //         mass: 0,
        //         restitution: 0.5
        //     },
        //     this.scene
        // );
        // this.physicsViewer.showImpostor(ground.physicsImpostor);




        const ground = MeshBuilder.CreateGroundFromHeightMap(
            "ground",
            "textures/heightMap.png", // black = low, white = high
            {
                width: 50,
                height: 50,
                subdivisions: 100,
                minHeight: 0,
                maxHeight: 5
            },
            this.scene
        );
        ground.checkCollisions = true;


        const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
        box.position = new Vector3(-8, 20, -5);
        box.rotation = new Vector3(Math.PI / 5, 0, 0);
        box.checkCollisions = true;


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

    }




    dispose() {
        window.removeEventListener("resize", this.handleResize); // stop listening
        this.scene.dispose();  // free all meshes, lights, materials in the scene
        this.engine.dispose(); // release WebGL resources tied to the canvas
    }
}