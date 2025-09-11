import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";

export class StandardMaterials {
  scene: Scene;
  engine: Engine;
  canvas: HTMLCanvasElement;  // Explicitly declare the canvas property

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;  // Assign the passed canvas to the class property
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  createScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 2, -10), scene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 1;

    
    const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 2 }, scene);
    ball.position = new Vector3(0, 1, 0);


    ground.material = this.CreateGroundMaterial();
    ball.material = this.CreateBallMaterial();

    return scene;
  }


  CreateGroundMaterial(): StandardMaterial {
    const groundMat = new StandardMaterial("groundMat", this.scene);
    const uvScale = 4;
    const texArray: Texture[] = [];

    const diffuseTex = new Texture(
      "./textures/stone/stone_diffuse.jpg",
      this.scene
    );
    groundMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);

    const normalTex = new Texture(
      "./textures/stone/stone_normal.jpg",
      this.scene
    );

    groundMat.bumpTexture = normalTex;
    groundMat.invertNormalMapX = true;
    groundMat.invertNormalMapY = true;
    texArray.push(normalTex);

    const aoTex = new Texture("./textures/stone/stone_ao.jpg", this.scene);
    groundMat.ambientTexture = aoTex;
    texArray.push(aoTex);

    const specTex = new Texture("./textures/stone/stone_spec.jpg", this.scene);
    groundMat.specularTexture = specTex;
    texArray.push(specTex);

    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    });

    return groundMat;
  }

  
  CreateBallMaterial(): StandardMaterial {
    const ballMat = new StandardMaterial("ballMat", this.scene);
    const uvScale = 1;
    const texArray: Texture[] = [];

    const diffuseTex = new Texture(
      "./textures/metal/metal_diffuse.jpg",
      this.scene
    );
    ballMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);

    const normalTex = new Texture(
      "./textures/metal/metal_normal.jpg",
      this.scene
    );
    ballMat.bumpTexture = normalTex;
    ballMat.invertNormalMapX = true;
    ballMat.invertNormalMapY = true;
    texArray.push(normalTex);

    const aoTex = new Texture("./textures/metal/metal_ao.jpg", this.scene);
    ballMat.ambientTexture = aoTex;
    texArray.push(aoTex);

    const specTex = new Texture("./textures/metal/metal_spec.jpg", this.scene);
    ballMat.specularTexture = specTex;
    ballMat.specularPower = 10;
    texArray.push(specTex);

    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    });

    return ballMat;
  }
}
