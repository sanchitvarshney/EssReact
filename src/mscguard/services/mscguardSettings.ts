import { mscGuardGet, mscGuardPut } from "./mscguardApi";
import type { FaceRecognitionSettings } from "../types/mscguardTypes";

export function fetchFaceRecognitionSettings(): Promise<FaceRecognitionSettings> {
  return mscGuardGet<FaceRecognitionSettings>("/api/settings/face-recognition");
}

export function updateFaceRecognitionSettings(input: Partial<FaceRecognitionSettings>): Promise<FaceRecognitionSettings> {
  return mscGuardPut<FaceRecognitionSettings>("/api/settings/face-recognition", input);
}
