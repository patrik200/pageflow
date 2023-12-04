import { config } from "@app/core-config";

export function getClientDomainByEnv(domain: string) {
  return config.productionEnv ? `https://${domain}` : `http://${domain}:3000`;
}
