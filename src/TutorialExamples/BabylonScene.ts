import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

export class BasicScene {
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
    const camera = new FreeCamera("camera", new Vector3(0, 1, -10), scene);
    camera.attachControl();

    const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.5;

    const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 5 }, scene);
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 2 }, scene);
    ball.position = new Vector3(0, 1, 0);

    return scene;
  }
}
