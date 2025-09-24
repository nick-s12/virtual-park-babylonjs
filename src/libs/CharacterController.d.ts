declare global {
    namespace org {
        namespace ssatguru {
            namespace babylonjs {
                namespace component {
                    class CharacterController {
                        constructor(mesh: any, camera: any, scene: any);
                        setCameraTarget(v: any): void;
                        setNoFirstPerson(v: boolean): void;
                        setStepOffset(v: number): void;
                        setSlopeLimit(min: number, max: number): void;
                        setIdleAnim(name: string, speed: number, loop: boolean): void;
                        setTurnLeftAnim(name: string, speed: number, loop: boolean): void;
                        setTurnRightAnim(name: string, speed: number, loop: boolean): void;
                        setWalkBackAnim(name: string, speed: number, loop: boolean): void;
                        setIdleJumpAnim(name: string, speed: number, loop: boolean): void;
                        setRunJumpAnim(name: string, speed: number, loop: boolean): void;
                        setFallAnim(name: string | null, speed: number, loop: boolean): void;
                        setSlideBackAnim(name: string, speed: number, loop: boolean): void;
                        start(): void;
                    }
                }
            }
        }
    }
}

export { };
