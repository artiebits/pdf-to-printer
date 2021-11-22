import os from "os";

export default function throwIfUnsupportedOs() {
  if (os.platform() !== "win32") {
    throw "Operating System not supported";
  }
}
