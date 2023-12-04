import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const localhostCorsConfig: CorsOptions = {
  origin: ["http://localhost:3000", "http://0.0.0.0:3000", "http://localhost:3001", "http://0.0.0.0:3001"],
  credentials: true,
  preflightContinue: true,
};
