/* @/lib/http-client/index.ts */

import type { HTTPClientBuilder } from './HTTPClient';
import {
  AxiosClientBuilder,
  RequestInterceptor,
  ResponseInterceptor,
} from './AxiosClient';

const requestInterceptor: RequestInterceptor = {
  async onFulfilled(config) {
    // (todo) this is just for test. refactor this please...!
    const user = JSON.parse(localStorage.getItem('user') || '');
    if (!user) return config;

    const { token } = user;
    config.headers!.Authorization = `${token}`;

    return config;
  },
  onRejected(err) {
    return Promise.reject(err);
  },
};

const responseInterceptor: ResponseInterceptor = {
  async onFulfilled(response) {
    return response;
  },
  onRejected(err) {
    return Promise.reject(err);
  },
};

export function createHttpClient(): HTTPClientBuilder {
  const builder: AxiosClientBuilder = new AxiosClientBuilder();
  return builder
    .setRequestInterceptor(requestInterceptor)
    .setResponseInterceptor(responseInterceptor)
    .setSuccessFilter((body: any) => body)
    .setFailFilter((body: any) => Promise.reject(body));
}
