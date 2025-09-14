import {
    CannonJSPlugin,
    CubeTexture,
    Engine,
    FreeCamera,
    Scene,
    SceneLoader,
    Vector3,
    StandardMaterial,
    Color3,
    ArcRotateCamera,
    Mesh,
    Texture,
    HemisphericLight,
    PBRMaterial,
    MeshBuilder,
    Axis,
    Space
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";
// import { CharacterController } from "babylonjs-charactercontroller";

import { loadCharacterController } from "../utils/loadCharacterController";


export class TestSceneController {
    private engine: Engine;
    private scene: Scene;
    private canvas!: HTMLCanvasElement;
    private handleResize: () => void;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas);
        this.engine.displayLoadingUI();

        this.scene = this.CreateScene();


        this.CreateSkybox();

        this.CreateEnvironment();

        // this.CreateController();

        this.CreateRamp();


        this.CreateTree_1();
        this.CreateTree_2();
        this.CreateTree_3();

        this.CreateTrashBin();
        this.CreateBench();


        this.CreateCamera_1();



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


    async CreateTree_1(): Promise<void> {
        const models = await SceneLoader.ImportMeshAsync("", "/models/", "tree_1.glb", this.scene);
        const meshes = models.meshes;
        console.log("meshes:", meshes);

        meshes.map(() => {
            // mesh.showBoundingBox = true;
            // mesh.checkCollisions = true;
        })
        meshes[0].position = new Vector3(-6, 0, 0);
        meshes[0].scaling = new Vector3(3, 3, 3);

        meshes[2].checkCollisions = true;
    }

    async CreateTree_2(): Promise<void> {
        const models = await SceneLoader.ImportMeshAsync("", "/models/", "pine_tree.glb", this.scene);
        const meshes = models.meshes;
        console.log("meshes:", meshes);

        meshes.map(() => {
            // mesh.showBoundingBox = true;
            // mesh.checkCollisions = true;
        })
        meshes[0].position = new Vector3(6, 0, 6);
        meshes[0].scaling = new Vector3(0.02, 0.02, 0.02);

        meshes[2].checkCollisions = true;
    }



    async CreateTree_3(): Promise<void> {
        const models = await SceneLoader.ImportMeshAsync("", "/models/", "fur_tree.glb", this.scene);
        const meshes = models.meshes;
        console.log("meshes:", meshes);

        meshes.map(() => {
            // mesh.showBoundingBox = true;
            // mesh.checkCollisions = true;
        })
        meshes[0].position = new Vector3(10, -1, 0);
        meshes[0].scaling = new Vector3(0.7, 0.7, 0.7);

        meshes[1].checkCollisions = true;
        meshes[2].checkCollisions = true;
    }


    async CreateTrashBin(): Promise<void> {
        const models = await SceneLoader.ImportMeshAsync("", "/models/", "trash_bin_1.glb", this.scene);
        const meshes = models.meshes;
        console.log("meshes:", meshes);

        meshes.map((mesh) => {
            // mesh.showBoundingBox = true;
            mesh.checkCollisions = true;

            if (mesh instanceof Mesh) {
                // 1️⃣ Bake transform into vertices
                mesh.bakeCurrentTransformIntoVertices();

                // 2️⃣ Clear quaternion so rotation works
                mesh.rotationQuaternion = null;

                // 3️⃣ Rotate 90° toward camera (Y-axis)
                mesh.rotate(Axis.Y, Math.PI / 2, Space.LOCAL);
            }
        })
        meshes[0].position = new Vector3(1.5, 0, 10);
        meshes[0].scaling = new Vector3(0.7, 0.7, 0.7);
    }


    async CreateBench(): Promise<void> {
        const models = await SceneLoader.ImportMeshAsync("", "/models/", "bench_1.glb", this.scene);
        const meshes = models.meshes;
        console.log("meshes:", meshes);

        meshes.map((mesh) => {
            // mesh.showBoundingBox = true;
            mesh.checkCollisions = true;
        })
        meshes[0].position = new Vector3(0, 0, 10);
        meshes[0].scaling = new Vector3(1.5, 1.5, 1.5);
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
        rampMaterial.albedoColor = new Color3(1, 0, 0.5);
        rampMaterial.roughness = 0.6;
        rampMaterial.metallic = 0.2;
        ramp.material = rampMaterial;
        ramp.position = new Vector3(0, -1, -8);

        ramp.checkCollisions = true;






        const ramp2 = MeshBuilder.CreateBox("ramp", { width: 20, depth: 5, height: 1 }, this.scene);
        ramp2.checkCollisions = true;
        ramp2.rotation.z = Math.PI / 8; // 45° slope
        // ramp.position.y = 2.5;

        const rampMaterial2 = new PBRMaterial("rampMaterial", this.scene);
        rampMaterial2.albedoColor = new Color3(0.5, 0.5, 0.5);
        rampMaterial2.roughness = 0.6;
        rampMaterial2.metallic = 0.2;
        ramp2.material = rampMaterial2;

        ramp2.position = new Vector3(-8, 1, -5);


    }


    async CreateCamera_1(): Promise<void> {
        const cameraTemp = new FreeCamera("camera", new Vector3(0, 20, -20), this.scene);
        cameraTemp.rotation = new Vector3(Math.PI / 6, 0, 0);
        cameraTemp.attachControl(this.canvas, true);


        const CharacterController = await loadCharacterController();
        console.log("CharacterController:", CharacterController);

        const hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);
        hemiLight.intensity = 0.8;


        SceneLoader.ImportMesh("", "models/player/", "Vincent.babylon", this.scene, (meshes, _, skeletons) => {
            let player = meshes[0] as Mesh;
            let skeleton = skeletons[0];
            player.skeleton = skeleton;

            skeleton.enableBlending(0.1);
            //if the skeleton does not have any animation ranges then set them as below
            // setAnimationRanges(skeleton);


            // // let sm = <StandardMaterial>player.material;
            let sm = player.material as StandardMaterial;
            if (sm.diffuseTexture != null) {
                console.log("diffuseTexture:", sm.diffuseTexture);

                sm.backFaceCulling = true;
                sm.ambientColor = new Color3(1, 1, 1);
                sm.emissiveColor = new Color3(1, 1, 1); // Slight boost to avoid pitch-black in low light
            }

            const pbr = new PBRMaterial("playerPBR", this.scene);
            pbr.albedoTexture = sm.diffuseTexture as Texture;
            pbr.roughness = 0.85; // Adjust as needed
            pbr.metallic = 0;  // Usually 0 for cloth/skin
            player.material = pbr;


            player.position = new Vector3(0, 12, 0);

            player.checkCollisions = true;
            player.ellipsoid = new Vector3(0.5, 1, 0.5);
            player.ellipsoidOffset = new Vector3(0, 1, 0);

            //rotate the camera behind the player
            let alpha = -player.rotation.y - 4.69;
            let beta = Math.PI / 2.5;
            let target = new Vector3(player.position.x, player.position.y + 1.5, player.position.z);

            console.log("laoding meshes 1.1");
            let camera = new ArcRotateCamera("ArcRotateCamera", alpha, beta, 5, target, this.scene);

            this.scene.activeCamera = camera;  // <---- CRUCIAL


            camera.wheelPrecision = 15;
            camera.checkCollisions = false;
            camera.keysLeft = [];
            camera.keysRight = [];
            camera.keysUp = [];
            camera.keysDown = [];



            // camera.lowerRadiusLimit = 2;
            // camera.upperRadiusLimit = 20;



            camera.lowerRadiusLimit = 0.2;
            camera.upperRadiusLimit = 4;
            camera.minZ = 0.1;



            camera.attachControl(this.canvas, false);

            const cc = new CharacterController(player, camera, this.scene);

            cc.setCameraTarget(new Vector3(0, 1.5, 0) as any);
            cc.setNoFirstPerson(false);
            cc.setStepOffset(0.4);
            cc.setSlopeLimit(30, 60);

            cc.setIdleAnim("idle", 1, true);
            cc.setTurnLeftAnim("turnLeft", 0.5, true);
            cc.setTurnRightAnim("turnRight", 0.5, true);
            cc.setWalkBackAnim("walkBack", 0.5, true);
            cc.setIdleJumpAnim("idleJump", .5, false);
            cc.setRunJumpAnim("runJump", 0.6, false);


            cc.setFallAnim(null as any, 2, false);
            cc.setSlideBackAnim("slideBack", 1, false)

            cc.start();
        });





    }



    dispose() {
        window.removeEventListener("resize", this.handleResize); // stop listening
        this.scene.dispose();  // free all meshes, lights, materials in the scene
        this.engine.dispose(); // release WebGL resources tied to the canvas
    }
}