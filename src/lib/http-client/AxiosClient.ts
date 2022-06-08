/* @/lib/http-client/FetchClient.ts */

import type HTTPClient from './HTTPClient.js';
import type { HTTPClientBuilder, Filter } from './HTTPClient.js';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestInterceptor {
  onFulfilled(
    value: AxiosRequestConfig<any>
  ): AxiosRequestConfig<any> | Promise<AxiosRequestConfig<any>>;
  onRejected(err: any): any;
}
export interface ResponseInterceptor {
  onFulfilled(
    value: AxiosResponse<any>
  ): AxiosResponse<any> | Promise<AxiosResponse<any>>;
  onRejected(err: any): any;
}

const identifier: Filter = (_) => _;

export default class AxiosClient implements HTTPClient {
  private _axiosClilent;
  private _successFilter = identifier;
  private _failFilter = identifier;

  constructor() {
    this._axiosClilent = axios.create();
  }

  set baseUrl(url: string) {
    this._axiosClilent.defaults.baseURL = url;
  }
  set requestInterceptor({ onFulfilled, onRejected }: RequestInterceptor) {
    this._axiosClilent.interceptors.request.use(onFulfilled, onRejected);
  }
  set responseInterceptor({ onFulfilled, onRejected }: ResponseInterceptor) {
    this._axiosClilent.interceptors.response.use(onFulfilled, onRejected);
  }
  set failFilter(filter: Filter) {
    this._failFilter = filter;
  }
  set successFilter(filter: Filter) {
    this._successFilter = filter;
  }

  get(url: string, config?: Record<string, unknown>): Promise<unknown> {
    return this._axiosClilent.get(url, config).then((res) => {
      return res.data.result !== 'SUCCESS'
        ? this._failFilter(res.data)
        : this._successFilter(res.data.data);
    });
  }

  post(
    url: string,
    body: unknown,
    config?: Record<string, unknown>
  ): Promise<unknown> {
    return this._axiosClilent.post(url, body, config).then((res) => {
      return res.data.result !== 'SUCCESS'
        ? this._failFilter(res.data)
        : this._successFilter(res.data.data);
    });
  }

  put(
    url: string,
    body: unknown,
    config?: Record<string, unknown>
  ): Promise<unknown> {
    return this._axiosClilent.put(url, body, config).then((res) => {
      return res.data.result !== 'SUCCESS'
        ? this._failFilter(res.data)
        : this._successFilter(res.data.data);
    });
  }

  patch(
    url: string,
    body: unknown,
    config?: Record<string, unknown>
  ): Promise<unknown> {
    return this._axiosClilent.patch(url, body, config).then((res) => {
      return res.data.result !== 'SUCCESS'
        ? this._failFilter(res.data)
        : this._successFilter(res.data.data);
    });
  }

  delete(url: string, config?: Record<string, unknown>): Promise<unknown> {
    return this._axiosClilent.delete(url, config).then((res) => {
      return res.data.result !== 'SUCCESS'
        ? this._failFilter(res.data)
        : this._successFilter(res.data.data);
    });
  }
}

export class AxiosClientBuilder implements HTTPClientBuilder {
  private readonly instance: AxiosClient;

  constructor() {
    this.instance = new AxiosClient();
  }

  setBaseUrl(url: string): AxiosClientBuilder {
    this.instance.baseUrl = url;
    return this;
  }

  setRequestInterceptor({
    onFulfilled,
    onRejected,
  }: RequestInterceptor): AxiosClientBuilder {
    this.instance.requestInterceptor = { onFulfilled, onRejected };
    return this;
  }

  setResponseInterceptor({
    onFulfilled,
    onRejected,
  }: ResponseInterceptor): AxiosClientBuilder {
    this.instance.responseInterceptor = { onFulfilled, onRejected };
    return this;
  }

  setFailFilter(filter: Filter): AxiosClientBuilder {
    this.instance.failFilter = filter;
    return this;
  }

  setSuccessFilter(filter: Filter): AxiosClientBuilder {
    this.instance.successFilter = filter;
    return this;
  }

  build(): HTTPClient {
    return this.instance;
  }
}
