import * as BABYLON from "@babylonjs/core";

let characterControllerPromise: Promise<any> | null = null;

export function loadCharacterController(): Promise<any> {
    // ✅ return cached promise if already loading or loaded
    if (characterControllerPromise) return characterControllerPromise;

    characterControllerPromise = new Promise((resolve, reject) => {
        (window as any).BABYLON = BABYLON;

        // 1️⃣ Already loaded? Return immediately
        if (window.org?.ssatguru?.babylonjs?.component?.CharacterController) {
            resolve(window.org.ssatguru.babylonjs.component.CharacterController);
            return;
        }

        // 2️⃣ Dynamically create <script> tag
        const script = document.createElement("script");
        script.src = "/libs/CharacterController.mjs"; // served from public/
        script.type = "module"; // so browser loads it as ESM
        script.async = true;

        script.onload = () => {
            const win = window as any;

            // Some versions attach directly to window.CharacterController
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

            if (window.org?.ssatguru?.babylonjs?.component?.CharacterController) {
                console.log("✅ CharacterController loaded successfully");
                resolve(window.org.ssatguru.babylonjs.component.CharacterController);
            } else {
                reject(new Error("❌ CharacterController did not attach to window"));
            }
        };

        script.onerror = () => reject(new Error("❌ Failed to load CharacterController.mjs"));

        document.body.appendChild(script);
    });

    return characterControllerPromise;
}