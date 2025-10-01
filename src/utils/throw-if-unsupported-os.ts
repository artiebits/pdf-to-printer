import os from "os";
import { UnsupportedOperatingSystemError } from "../types/errors";

export default function throwIfUnsupportedOs() {
  if (os.platform() !== "win32") {
    throw new UnsupportedOperatingSystemError();
  }
}
