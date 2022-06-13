export interface PKBResponse<Data> {
  result: 'SUCCESS' | 'FAIL';
  message: string | null;
  errorCode: string; // 'AUTH_INVALID_TOKEN'
  timestamp: string;
  data?: Data;
}
