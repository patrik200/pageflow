import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class AppRequestError extends Error {
  static isRequestError(data: any): data is AppRequestError {
    return data instanceof AppRequestError;
  }

  private static prepareAxiosConfigForDebug(config: AxiosRequestConfig) {
    return {
      timeout: config.timeout,
      headers: config.headers,
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      data: config.data,
    };
  }

  static buildFromAxiosError(error: AxiosError<any>) {
    return new AppRequestError(
      {
        message: error.response?.data?.message || error.message,
        statusCode: error.response?.status ?? -1,
        response: error.response,
        cancelled: axios.isCancel(error),
      },
      { axiosConfig: this.prepareAxiosConfigForDebug(error.config), stack: error.stack },
    );
  }

  constructor(
    public data: { message: string; statusCode: number; response?: AxiosResponse; cancelled?: boolean },
    public debug?: any,
  ) {
    super(data.message);
    if (typeof window !== "undefined" && (window as any).disableAppRequestErrorLogger) return;
    console.log("Debug info:");
    console.dir(debug, { depth: 30 });
    console.log("Serialized response:");
    console.dir(this.serialize().data, { depth: 30 });
  }

  serialize() {
    return { message: this.data.message, statusCode: this.data.statusCode, data: this.data.response?.data ?? null };
  }
}
