/* @/lib/http-client/HTTPClient.ts */

export default interface HTTPClient {
  get(url: string, config: Record<string, unknown>): Promise<unknown>;
  post(
    url: string,
    body: unknown,
    config: Record<string, unknown>
  ): Promise<unknown>;
  put(
    url: string,
    body: unknown,
    config: Record<string, unknown>
  ): Promise<unknown>;
  patch(
    url: string,
    body: unknown,
    config: Record<string, unknown>
  ): Promise<unknown>;
  delete(url: string, config: Record<string, unknown>): Promise<unknown>;
}

export type Filter = (
  body: Record<string, unknown>
) => Record<string, unknown> | Promise<unknown>;

export interface HTTPClientBuilder {
  setBaseUrl(url: string): HTTPClientBuilder;
  setSuccessFilter(filter: Filter): HTTPClientBuilder;
  setFailFilter(filter: Filter): HTTPClientBuilder;
  build(): HTTPClient;
}
