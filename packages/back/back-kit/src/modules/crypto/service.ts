import { Injectable } from "@nestjs/common";
import crypto from "node:crypto";

type Key = string;

@Injectable()
export class CryptoService {
  generateHash(payload: string | Buffer) {
    return crypto.createHash("sha1").update(payload).digest("base64url");
  }

  compareTextWithHash(payload: string | Buffer, hash: string) {
    return this.generateHash(payload) === hash;
  }

  sign(key: Key, payload: string) {
    return payload + "." + crypto.createHmac("sha256", key).update(payload).digest("base64url");
  }

  unsign(key: Key, signedPayload: string) {
    const payload = signedPayload.slice(0, signedPayload.indexOf("."));
    const newSignedPayload = this.sign(key, payload);
    return this.generateHash(signedPayload) === this.generateHash(newSignedPayload) ? payload : false;
  }

  private getCryptoIv(cryptoIv: string) {
    return Buffer.from(cryptoIv, "base64url");
  }

  encrypt(key: Key, text: string | Buffer, cryptoIv: string) {
    const cipher = crypto.createCipheriv("aes-256-ctr", key, this.getCryptoIv(cryptoIv));
    return Buffer.concat([cipher.update(text), cipher.final()]);
  }

  decrypt(key: Key, encryptedText: string | Buffer, cryptoIv: string) {
    const decipher = crypto.createDecipheriv("aes-256-ctr", key, this.getCryptoIv(cryptoIv));
    return Buffer.concat([
      decipher.update(Buffer.isBuffer(encryptedText) ? encryptedText : Buffer.from(encryptedText, "base64url")),
      decipher.final(),
    ]);
  }

  generateRandom(length: number) {
    return crypto.randomBytes(length).toString("base64url");
  }
}
