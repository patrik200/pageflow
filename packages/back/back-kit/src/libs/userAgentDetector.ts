import { name as axiosName, version as axiosVersion } from "axios/package.json";
import UAParser from "ua-parser-js";

const httpLib = `${axiosName}/${axiosVersion}`;

export class UserAgentDetector {
  constructor(private hostName: string, private clientName: string) {}

  private generateUserAgentIdentityPart(
    key: string,
    main: string | undefined,
    additionalStrings: (string | undefined)[] = [],
  ) {
    if (!main) return "";
    const additionalParts = additionalStrings.map((part) => part || "").join(":");
    return `${key}:${main} ${additionalParts}`;
  }

  generateUserAgent(userAgentString: string) {
    const ua = new UAParser(userAgentString);
    const { name: browserName, version: browserVersion } = ua.getBrowser();
    const { name: osName, version: osVersion } = ua.getOS();
    const { model: deviceModel, type: deviceType, vendor: deviceVendor } = ua.getDevice();
    const identityParts = [
      this.hostName,
      this.generateUserAgentIdentityPart("os", osName, [osVersion]),
      this.generateUserAgentIdentityPart("device", deviceModel, [deviceType, deviceVendor]),
      this.generateUserAgentIdentityPart("browser", browserName, [browserVersion]),
    ]
      .filter((part) => part)
      .join("; ");

    return `${this.clientName} (${identityParts}) ${httpLib}`;
  }
}
