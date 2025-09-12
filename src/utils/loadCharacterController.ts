// utils/loadCharacterController.ts
import * as BABYLON from "@babylonjs/core";


export async function loadCharacterController(): Promise<any> {
    // ✅ Make sure CharacterController sees BABYLON as global
    (window as any).BABYLON = BABYLON;


    // 1. Already loaded? Just return it
    if (window.org?.ssatguru?.babylonjs?.component?.CharacterController) {
        return window.org.ssatguru.babylonjs.component.CharacterController;
    }

    // 2. Dynamically import the script (executes it, no exports needed)
    await import("../libs/CharacterController.mjs");

    // 3. Check if CharacterController attached somewhere
    const win = window as any;

    // Some builds attach it as window.CharacterController (not under window.org)
    if (win.CharacterController && !win.org) {
        win.org = {
            ssatguru: {
                babylonjs: {
                    component: {
                        CharacterController: win.CharacterController,
                    },
                },
            },
        };
    }

    // 4. Verify it exists now
    if (!window.org?.ssatguru?.babylonjs?.component?.CharacterController) {
        console.error("❌ CharacterController did not attach to window.org — check CharacterController.js");
        throw new Error("CharacterController did not load — check that ../libs/CharacterController.js attaches to window.org");
    }

    console.log("✅ CharacterController loaded successfully");
    return window.org.ssatguru.babylonjs.component.CharacterController;
}
