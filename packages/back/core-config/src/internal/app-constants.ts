import path, { join } from "path";
import { config } from "dotenv";

export const ROOT_PATH = path.join(process.cwd(), "..", "..", "..");
export const ENV_FILE_NAME = ".env";

export const env = { ...process.env, ...(config({ path: join(ROOT_PATH, ENV_FILE_NAME) }).parsed as any) } as Record<
  string,
  string
>;

export const IS_PROD = process.env.NODE_ENV === "production";
