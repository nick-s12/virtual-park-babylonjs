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
    PointLight,
    Light,
    LightGizmo,
    GizmoManager,
    GlowLayer,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

import { loadCharacterController } from "../utils/loadCharacterController";


export class TestSceneControllerPark {
    private engine: Engine;
    private scene: Scene;
    private canvas!: HTMLCanvasElement;
    private handleResize: () => void;

    private isNight: boolean = true;


    private groundLoaded: boolean = false;
    private playerLoaded: boolean = false;
    private characterControler: any;

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

        window.addEventListener("keydown", (event) => {
            if (event.key === "n" || event.key === "N") {
                this.isNight = !this.isNight;
                console.log("Night mode:", this.isNight);

                this.onNightModeChanged(); // call a function to update scene

                this.updateEnvironmentForNight();

            }
        });
    }


    private onNightModeChanged() {
        if (this.isNight) {
            // this.scene.lights.forEach(light => light.intensity *= 0.3);
        } else {
            // this.scene.lights.forEach(light => light.intensity *= 3.33); // reverse dimming
        }

        if (this.scene.environmentTexture) {
            this.scene.environmentTexture.dispose();
        }
        if (this.scene.getGlowLayerByName("lampGlow")) {
            this.scene.getGlowLayerByName("lampGlow")?.dispose();
        }

        this.CreateSkybox(); // call again after toggling isNight


    }



    private updateEnvironmentForNight() {
        // Update lamp lights
        this.scene.meshes.forEach(mesh => {
            if (["defaultMaterial.073", "defaultMaterial.007", "defaultMaterial.039", "defaultMaterial.016", "defaultMaterial.053"].includes(mesh.name)) {
                const light = this.scene.getLightByName(`pointLight_${mesh.name}`) as PointLight;
                if (light) {
                    light.setEnabled(this.isNight);
                }
            }
        });

        // Update ground materials
        ["GroundRight", "GroundLeft"].forEach(name => {
            const ground = this.scene.getMeshByName(name);
            if (ground && ground.material) {
                (ground.material as StandardMaterial).diffuseColor = this.isNight ? new Color3(1.3, 1.3, 1.3) : new Color3(15, 15, 15);
            }
        });
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


        const glow = new GlowLayer("lampGlow", this.scene); // create glow layer
        glow.intensity = 0.3;                          // control how strong the glow is

    }

    private tryStartGame(): void {
        console.log(this.groundLoaded)
        console.log(this.playerLoaded);


        if (this.groundLoaded && this.playerLoaded) {
            console.log("✅ Both ground and player are ready, starting game...");
            this.characterControler.start();
        }
    }

    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Park.glb?v=2",
            // "output_draco.glb",
            this.scene
        );
        this.groundLoaded = true;
        this.tryStartGame();


        meshes.map((mesh) => {
            // console.log(mesh);
            // console.log(mesh.name);

            mesh.checkCollisions = true;

            if (this.isNight) {
                if (mesh.name == "defaultMaterial.073" ||
                    mesh.name == "defaultMaterial.007" ||
                    mesh.name == "defaultMaterial.039" ||
                    mesh.name == "defaultMaterial.016" ||
                    mesh.name == "defaultMaterial.053"
                ) {
                    if (mesh.material) {
                        if (mesh.material instanceof PBRMaterial || mesh.material instanceof StandardMaterial) {
                            (mesh.material as any).maxSimultaneousLights = 100; // or more
                        }
                    }


                    const pointLight = new PointLight(
                        `pointLight_${mesh.name}`,
                        new Vector3(0, 0.7, 0),
                        this.scene
                    );

                    // this.CreateGizmos(pointLight);

                    pointLight.diffuse = new Color3(1, 0.9, 0.7); // warm white/yellow
                    pointLight.intensity = 5;                  // bright enough
                    pointLight.range = 4;                        // covers small radius around lamp


                    pointLight.setEnabled(true);
                    console.log("Light is enabled:", pointLight.isEnabled());

                    pointLight.parent = mesh;

                }
            }


            if (mesh.name === "GroundRight" || mesh.name === "GroundLeft") {
                mesh.checkCollisions = false;


                console.log("GroundRight");

                const material = new StandardMaterial("grassMat", this.scene);
                material.diffuseTexture = new Texture("textures/grass/grass_1.jpg", this.scene);

                if (material) {
                    if (material instanceof PBRMaterial || material instanceof StandardMaterial) {
                        (material as any).maxSimultaneousLights = 100; // or more
                    }
                }

                // Cast to Texture to access uScale/vScale
                const tex = material.diffuseTexture as Texture;
                tex.uScale = 30;    // repeats along width
                tex.vScale = 2;   // repeats along length

                // material.emissiveColor = new Color3(0.8, 0.8, 0.8);

                if (this.isNight) {
                    material.diffuseColor = new Color3(1.3, 1.3, 1.3); // >1 brightens

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



                if (this.isNight) {
                    pbr.emissiveColor = Color3.Black();      // pavement itself does not emit light
                    pbr.albedoColor = new Color3(2, 2, 2);     // use neutral albedo for lighting
                    pbr.roughness = 0.2;

                } else {
                    pbr.albedoColor = new Color3(3, 3, 3);     // use neutral albedo for lighting

                    pbr.roughness = 0.5;                       // non-reflective surface for better light spread

                }

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


            player.position = new Vector3(-12, 15, -13);

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

            this.characterControler = new CharacterController(player, camera, this.scene);

            this.characterControler.setCameraTarget(new Vector3(0, 1.5, 0) as any);
            this.characterControler.setNoFirstPerson(false);
            this.characterControler.setStepOffset(0.4);
            this.characterControler.setSlopeLimit(30, 60);

            this.characterControler.setIdleAnim("idle", 1, true);
            this.characterControler.setTurnLeftAnim("turnLeft", 0.5, true);
            this.characterControler.setTurnRightAnim("turnRight", 0.5, true);
            this.characterControler.setWalkBackAnim("walkBack", 0.5, true);
            this.characterControler.setIdleJumpAnim("idleJump", .5, false);
            this.characterControler.setRunJumpAnim("runJump", 0.6, false);


            this.characterControler.setFallAnim(null as any, 2, false);
            this.characterControler.setSlideBackAnim("slideBack", 1, false)

            // cc.start();

            this.playerLoaded = true;
            this.tryStartGame();
        });





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



    dispose() {
        window.removeEventListener("resize", this.handleResize); // stop listening
        this.scene.dispose();  // free all meshes, lights, materials in the scene
        this.engine.dispose(); // release WebGL resources tied to the canvas
    }
}