import axios, { AxiosAdapter, AxiosError, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";
import { template, isNil, mergeDeepRight, path } from "@worksolutions/utils";
import { Constructable } from "typedi";

import { BaseEntity } from "entities/BaseEntity";

import { makeTransformableObject } from "libs";

import { AppRequestError } from "./AppRequestError";

export enum METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export type AfterRequestSuccessMiddlewareMutableConfig = Pick<
  RequestOptions<any>,
  | "serverDataEntityDecoder"
  | "serverDataEntityDecoderValidationGroups"
  | "returnRaw"
  | "validateDecoder"
  | "responseDataFieldPath"
>;

export interface ErrorMiddlewareData {
  error: AppRequestError;
  config: AxiosRequestConfig;
  shareData: Record<string, any>;
  makeRequest: (
    overrideRequestData?: RequestData,
  ) =>
    | [{ requestData: AxiosRequestConfig; axiosResponse: AxiosResponse }, null]
    | [null, { requestData: AxiosRequestConfig; axiosError: AxiosError }];
}

export class RequestManager {
  beforeRequestMiddleware: ((data: { config: AxiosRequestConfig }) => void | Promise<void>)[] = [];
  afterRequestMiddleware: ((data: {
    config: AxiosRequestConfig;
    axiosResponse: AxiosResponse;
  }) => void | Promise<void>)[] = [];
  afterRequestSuccessMiddleware: ((data: {
    mutableConfig: AfterRequestSuccessMiddlewareMutableConfig;
    axiosResponse: AxiosResponse;
  }) => void | Promise<void>)[] = [];

  errorMiddleware: ((data: ErrorMiddlewareData) => AppRequestError | Promise<AppRequestError | null> | null | any)[] =
    [];

  constructor(private baseURL = "", private requestManagerOptions: { axiosAdapter?: AxiosAdapter } = {}) {}

  private async applyAllBeforeRequestMiddleware(config: AxiosRequestConfig) {
    for (let i = 0; i < this.beforeRequestMiddleware.length; i++) {
      const middleware = this.beforeRequestMiddleware[i];
      await middleware({ config });
    }
  }

  private async applyAllAfterRequestMiddleware(config: AxiosRequestConfig, axiosResponse: AxiosResponse) {
    for (let i = 0; i < this.afterRequestMiddleware.length; i++) {
      const middleware = this.afterRequestMiddleware[i];
      await middleware({ config, axiosResponse });
    }
  }

  private async appleAllAfterRequestSuccessMiddleware(
    mutableConfig: AfterRequestSuccessMiddlewareMutableConfig,
    axiosResponse: AxiosResponse,
  ) {
    for (let i = 0; i < this.afterRequestSuccessMiddleware.length; i++) {
      const middleware = this.afterRequestSuccessMiddleware[i];
      await middleware({ mutableConfig, axiosResponse });
    }
  }

  private async applyAllErrorMiddleware(
    config: AxiosRequestConfig,
    {
      requestData = {},
      error,
      makeRequest,
    }: { requestData?: RequestData; error: AppRequestError; makeRequest: (overrideRequestData?: RequestData) => any },
  ) {
    if (requestData.disableErrorMiddlewares) return error;

    const shareData: Record<string, any> = {};
    for (let i = 0; i < this.errorMiddleware.length; i++) {
      const middleware = this.errorMiddleware[i];
      const middlewareResult = await middleware({ error, config, shareData, makeRequest });
      if (AppRequestError.isRequestError(middlewareResult)) {
        error = middlewareResult;
        continue;
      }
      if (isNil(middlewareResult)) break;
      return middlewareResult;
    }

    return error;
  }

  private async makeRequest({
    url,
    method,
    responseType,
    headers,
    requestConfig,
    withCredentials,
    requestData: {
      progressReceiver,
      urlParams,
      additionalQueryParams,
      body,
      headers: requestDataHeaders = {},
      abortSignal,
    },
  }: Required<Pick<RequestOptions<any>, "url" | "method" | "requestConfig" | "headers" | "withCredentials">> &
    Pick<RequestOptions<any>, "responseType"> & {
      requestData: RequestData;
    }) {
    const requestData: AxiosRequestConfig = {
      url,
      method,
      adapter: this.requestManagerOptions.axiosAdapter,
      baseURL: this.baseURL,
      withCredentials,
      responseType,
      headers: Object.assign({ Accept: "application/json" }, headers, requestDataHeaders),
      signal: abortSignal,
    };

    if (requestConfig.contentType) requestData.headers!["Content-Type"] = requestConfig.contentType;

    requestData[method === METHODS.GET ? "params" : "data"] = body;

    if (urlParams) requestData.url = template(requestData.url!, urlParams);

    if (additionalQueryParams) requestData.params = additionalQueryParams;

    if (progressReceiver)
      requestData.onUploadProgress = function ({ loaded, total }) {
        progressReceiver!(loaded / total);
      };

    try {
      //TODO: сделать иммутабельным
      await this.applyAllBeforeRequestMiddleware(requestData);
      const axiosResponse = await axios(requestData);
      await this.applyAllAfterRequestMiddleware(requestData, axiosResponse);
      return [{ requestData, axiosResponse }, null] as const;
    } catch (axiosError) {
      return [
        null,
        { requestData, axiosError } as { requestData: AxiosRequestConfig; axiosError: AxiosError },
      ] as const;
    }
  }

  createRequest<DecoderValue extends BaseEntity>({
    url,
    headers = {},
    responseType,
    method,
    withCredentials = false,
    requestConfig = {},
    ...otherCreateRequestOptions
  }: RequestOptions<DecoderValue>) {
    // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
    return async (requestData: RequestData = {}): Promise<DecoderValue> => {
      const makeRequest = (overrideRequestData: Omit<RequestData, "onError" | "onSuccess"> = {}) =>
        this.makeRequest({
          url,
          headers,
          responseType,
          method,
          withCredentials,
          requestConfig,
          requestData: mergeDeepRight(requestData, overrideRequestData),
        });

      const makeRequestResult = await makeRequest();
      const requestError = makeRequestResult[1];
      let requestResult = makeRequestResult[0];

      if (requestError) {
        if (!requestError.axiosError.config) requestError.axiosError.config = requestError.requestData;
        const convertedError = await this.applyAllErrorMiddleware(requestError.requestData, {
          error: AppRequestError.buildFromAxiosError(requestError.axiosError),
          requestData,
          makeRequest,
        });

        if (AppRequestError.isRequestError(convertedError)) {
          if (requestData.onError) {
            if (!convertedError.data.cancelled || !!requestData.runOnErrorForCanceledRequest)
              requestData.onError({ config: requestError.requestData, requestError: convertedError });
          }
          throw convertedError;
        }

        if (!isNil(convertedError)) requestResult = convertedError;
      }

      if (!requestResult) return null!;

      const mutableConfig = {
        serverDataEntityDecoder: otherCreateRequestOptions.serverDataEntityDecoder,
        serverDataEntityDecoderValidationGroups: otherCreateRequestOptions.serverDataEntityDecoderValidationGroups,
        returnRaw: otherCreateRequestOptions.returnRaw ?? false,
        validateDecoder: otherCreateRequestOptions.validateDecoder ?? true,
        responseDataFieldPath: otherCreateRequestOptions.responseDataFieldPath ?? [],
      };
      await this.appleAllAfterRequestSuccessMiddleware(mutableConfig, requestResult.axiosResponse);
      const {
        serverDataEntityDecoder,
        serverDataEntityDecoderValidationGroups,
        returnRaw,
        validateDecoder,
        responseDataFieldPath,
      } = mutableConfig;

      if (returnRaw) {
        if (requestData.onSuccess)
          requestData.onSuccess({ config: requestResult.requestData, axiosResponse: requestResult.axiosResponse });
        return path(responseDataFieldPath, requestResult.axiosResponse.data) as any;
      }

      if (!serverDataEntityDecoder) return null!;

      try {
        const plainResult = path(responseDataFieldPath, requestResult.axiosResponse.data) as any;
        const instance = makeTransformableObject(serverDataEntityDecoder, (plainInstance) =>
          plainInstance.__schemaTransform ? plainInstance.__schemaTransform(plainResult) : plainResult,
        );

        if (validateDecoder) {
          const [validationError] = await instance.validateAsync({
            stopAtFirstError: true,
            groups: serverDataEntityDecoderValidationGroups,
          });
          if (validationError) throw validationError;
        }

        if (requestData.onSuccess)
          requestData.onSuccess({ config: requestResult.requestData, axiosResponse: requestResult.axiosResponse });

        return instance;
      } catch (e) {
        const convertedError = await this.applyAllErrorMiddleware(requestResult.requestData, {
          error: new AppRequestError(
            { message: (e as Error).message, statusCode: -1, response: undefined },
            { error: e },
          ),
          requestData,
          makeRequest,
        });

        if (AppRequestError.isRequestError(convertedError)) {
          if (requestData.onError)
            requestData.onError({ config: requestResult.requestData, requestError: convertedError });
          throw convertedError;
        }
        if (!isNil(convertedError)) return convertedError;
        return null!;
      }
    };
  }
}

export interface RequestOptions<DecoderGenericType extends BaseEntity> {
  url: string;
  method: METHODS;
  responseType?: ResponseType;
  headers?: Record<string, string>;
  serverDataEntityDecoder?: Constructable<DecoderGenericType>;
  serverDataEntityDecoderValidationGroups?: string[];
  returnRaw?: boolean;
  validateDecoder?: boolean;
  requestConfig?: { contentType?: string };
  responseDataFieldPath?: string[];
  withCredentials?: boolean;
}

export interface ApiErrorCallbackDataInterface {
  requestError: Error | AppRequestError;
  config: AxiosRequestConfig;
}

export interface ApiSuccessCallbackDataInterface {
  config: AxiosRequestConfig;
  axiosResponse: AxiosResponse;
}

export interface RequestData {
  body?: any;
  headers?: Record<string, string>;
  additionalQueryParams?: Record<string, string | number>;
  urlParams?: Record<string, string | number>;
  disableErrorMiddlewares?: boolean;
  abortSignal?: AbortSignal;
  progressReceiver?: (progress: number) => void;
  runOnErrorForCanceledRequest?: boolean;
  onError?: (data: ApiErrorCallbackDataInterface) => void;
  onSuccess?: (data: ApiSuccessCallbackDataInterface) => void;
}

export * from "./AppRequestError";
export * from "./axiosAdapter";
