import { execFile } from "child_process";
import util from "util";

const execFileAsync = util.promisify(execFile);

export default execFileAsync;
