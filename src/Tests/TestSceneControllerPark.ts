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
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

import { loadCharacterController } from "../utils/loadCharacterController";


export class TestSceneControllerPark {
    private engine: Engine;
    private scene: Scene;
    private canvas!: HTMLCanvasElement;
    private handleResize: () => void;

    private isNight: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas);
        this.engine.displayLoadingUI();

        this.scene = this.CreateScene();

        this.CreateSkybox();

        this.CreateEnvironment();

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
        let envFile;
        if (this.isNight) {
            envFile = "./environment/preller_drive_2k.env"
        } else {
            envFile = "./environment/park.env"
        }
        const envTex = CubeTexture.CreateFromPrefilteredData(
            envFile,
            this.scene
        );
        envTex.gammaSpace = false;
        envTex.rotationY = Math.PI;
        this.scene.environmentTexture = envTex;
        this.scene.createDefaultSkybox(envTex, true, 2000, 0.07);

        if (this.isNight) {
            this.scene.environmentIntensity = 0.01;
        } else {
            this.scene.environmentIntensity = 0.8;
        }

    }


    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Park.glb",
            // "output_draco.glb",
            this.scene
        );



        meshes.map((mesh) => {
            console.log(mesh);
            console.log(mesh.name);

            mesh.checkCollisions = true;


            if (mesh.name === "GroundRight" || mesh.name === "GroundLeft") {
                mesh.checkCollisions = false;

                console.log("GroundRight");

                const material = new StandardMaterial("grassMat", this.scene);
                material.diffuseTexture = new Texture("textures/grass/grass_1.jpg", this.scene);


                // Cast to Texture to access uScale/vScale
                const tex = material.diffuseTexture as Texture;
                tex.uScale = 30;    // repeats along width
                tex.vScale = 2;   // repeats along length

                // material.emissiveColor = new Color3(0.8, 0.8, 0.8);

                if (this.isNight) {
                    material.diffuseColor = new Color3(1.9, 1.9, 1.9); // >1 brightens

                } else {
                    material.diffuseColor = new Color3(15, 15, 15); // >1 brightens
                }

                mesh.material = material;
            }


            if (mesh.name === "GroundMiddle") {
                mesh.checkCollisions = false;

                const pbr = new PBRMaterial("mat", this.scene);

                const uScale = 30;
                const vScale = 1.5;

                pbr.albedoTexture = new Texture("/textures/pavement_1/diffuse.jpg", this.scene);
                pbr.albedoColor = new BABYLON.Color3(2.5, 2.5, 2.5); // >1 brightens, <1 darkens
                (pbr.albedoTexture as Texture).uScale = uScale;  // repeat  along X
                (pbr.albedoTexture as Texture).vScale = vScale; // repeat  along Z


                pbr.bumpTexture = new Texture("/textures/pavement_1/normal.jpg", this.scene);
                (pbr.bumpTexture as Texture).uScale = uScale;  // repeat  along X
                (pbr.bumpTexture as Texture).vScale = vScale; // repeat  along Z


                pbr.metallicTexture = new Texture("/textures/pavement_1/ao.jpg", this.scene);
                (pbr.metallicTexture as Texture).uScale = uScale;  // repeat  along X
                (pbr.metallicTexture as Texture).vScale = vScale; // repeat  along Z


                pbr.useAmbientOcclusionFromMetallicTextureRed = true;
                pbr.useRoughnessFromMetallicTextureGreen = true;
                pbr.useMetallnessFromMetallicTextureBlue = true;

                console.log("GroundMiddle");
                mesh.material = pbr;
            }

            if (mesh.name === "SeparatorLeftLeft" || mesh.name === "SeparatorLeftRight") {
                mesh.checkCollisions = false;
            }
        })

        this.engine.hideLoadingUI();
    }


    async CreateCamera_1(): Promise<void> {
        const cameraTemp = new FreeCamera("camera", new Vector3(0, 20, -20), this.scene);
        cameraTemp.rotation = new Vector3(Math.PI / 6, 0, 0);
        cameraTemp.attachControl(this.canvas, true);


        const CharacterController = await loadCharacterController();
        console.log("CharacterController:", CharacterController);

        const hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);


        if (this.isNight) {
            hemiLight.intensity = 0.15;
        } else {
            hemiLight.intensity = 0.6;
        }


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


            player.position = new Vector3(-12, 7, -13);

            player.checkCollisions = true;
            player.ellipsoid = new Vector3(0.5, 1, 0.5);
            player.ellipsoidOffset = new Vector3(0, 1, 0);

            player.rotation.y = -1.5;

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
            camera.upperRadiusLimit = 10;
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