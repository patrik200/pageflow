import ms from "ms";

import { env, IS_PROD, ROOT_PATH } from "./internal/app-constants";
import { parseBool, parseNum } from "./parsers/parsePrimitives";

export const config = {
  productionEnv: IS_PROD,
  rootPath: ROOT_PATH,
  server: 8000,
  wsServer: 8001,
  typeorm: {
    type: "postgres",
    host: env.DB_HOST,
    port: parseNum(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  s3: {
    host: env.S3_HOST,
    port: parseNum(env.S3_PORT),
  },
  elastic: {
    host: env.ELASTIC_HOST,
    port: parseNum(env.ELASTIC_PORT),
  },
  auth: {
    accessTokenExpiresInMS: IS_PROD ? ms("2h") : ms("12w"),
    refreshTokenExpiresInMS: ms("60d"),
    tokenBackgroundExpiresCheckMs: ms("12h"),
  },
  tickets: {
    autoArchiveCheckIntervalMs: ms("2h"),
    autoArchiveAfterDays: 7,
  },
  documentRevisions: {
    userFlowDeadlineCheckIntervalMs: ms("2h"),
    approvingDeadlineCheckIntervalMs: ms("2h"),
  },
  projects: {
    autoArchiveCheckIntervalMs: ms("2h"),
    autoArchiveAfterDays: 14,
    endDatePlanCheckIntervalMs: ms("2h"),
  },
  users: {
    unavailableUntilCheckIntervalMs: ms("2h"),
  },
  restorePassword: {
    restorePasswordTokenExpiresInMS: IS_PROD ? ms("2h") : ms("5m"),
  },
  subscription: {
    gracePeriodDays: 3,
    checkForAutoRenewIntervalMs: ms("5m"),
  },
  payments: {
    checkNewPaymentsIntervalMs: ms("4s"),
    checkForCancelIntervalMs: ms("2m"),
  },
  email: {
    verify: IS_PROD,
    queueMaxElements: 3,
  },
  ipc: { serverName: "app-ipc-server", clientName: "app-ipc-client" },
  notifications: {
    checkIntervalMs: IS_PROD ? ms("3m") : ms("20s"),
    enabled: parseBool(env.ENABLE_EMAIL_NOTIFICATIONS, false),
  },
  invitations: {
    tokenExpiresInMS: ms("1d"),
  },
  _secrets: {
    cookies: {
      key: env.COOKIE_SECRET,
    },
    s3: {
      access: env.S3_ACCESS_KEY,
      secret: env.S3_SECRET_KEY,
    },
    auth: {
      cryptoIv: env.AUTH_JWT_CRYPTO_IV,
      sign: env.AUTH_JWT_SIGN,
    },
    restorePassword: {
      sign: env.RESTORE_PASSWORD_SIGN,
      cryptoIv: env.RESTORE_PASSWORD_CRYPTO_IV,
    },
    email: {
      host: env.EMAIL_SMTP_HOST,
      port: parseNum(env.EMAIL_SMTP_PORT),
      user: env.EMAIL_SMTP_USER,
      password: env.EMAIL_SMTP_PASSWORD,
    },
    yookassa: {
      secretKey: env.PAYMENTS_YOOKASSA_SECRET_KEY,
      shopId: env.PAYMENTS_YOOKASSA_SHOP_ID,
    },
  },
};

export * from "./parsers/parsePrimitives";
