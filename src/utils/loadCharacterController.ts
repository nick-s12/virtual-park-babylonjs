// utils/loadCharacterController.ts
import * as BABYLON from "@babylonjs/core";


// export async function loadCharacterController(): Promise<any> {
//     // ✅ Make sure CharacterController sees BABYLON as global
//     (window as any).BABYLON = BABYLON;


//     // 1. Already loaded? Just return it
//     if (window.org?.ssatguru?.babylonjs?.component?.CharacterController) {
//         return window.org.ssatguru.babylonjs.component.CharacterController;
//     }

//     // 2. Dynamically import the script (executes it, no exports needed)
//     await import("../libs/test_CharacterController.mjs");

//     // 3. Check if CharacterController attached somewhere
//     const win = window as any;

//     // Some builds attach it as window.CharacterController (not under window.org)
//     if (win.CharacterController && !win.org) {
//         win.org = {
//             ssatguru: {
//                 babylonjs: {
//                     component: {
//                         CharacterController: win.CharacterController,
//                     },
//                 },
//             },
//         };
//     }

//     // 4. Verify it exists now
//     if (!window.org?.ssatguru?.babylonjs?.component?.CharacterController) {
//         console.error("❌ CharacterController did not attach to window.org — check CharacterController.js");
//         throw new Error("CharacterController did not load — check that ../libs/CharacterController.js attaches to window.org");
//     }

//     console.log("✅ CharacterController loaded successfully");
//     return window.org.ssatguru.babylonjs.component.CharacterController;
// }



// ✅ cache the promise globally so we load only once
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