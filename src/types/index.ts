export interface PKBResponse<Data> {
  result: 'SUCCESS' | 'FAIL';
  message: string | null;
  errorCode: number | null;
  timestamp: string;
  data?: Data;
}
