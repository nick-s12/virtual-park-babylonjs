import * as BABYLON from "@babylonjs/core";

window.BABYLON = BABYLON; // UMD file expects BABYLON as global

// ✅ Load the raw UMD file from public (works in dev & build)
await import("/libs/CharacterController.mjs");

// Get the global CharacterController
const CharacterController =
    window.org?.ssatguru?.babylonjs?.component?.CharacterController ??
    window.CharacterController;

if (!CharacterController) {
    throw new Error("❌ CharacterController did not attach to window");
}

export default CharacterController;
