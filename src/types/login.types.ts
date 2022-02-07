interface CommonResponse {
  result: 'SUCCESS' | 'FAIL';
  message: string | null;
  errorCode: number | null;
  timestamp: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse extends CommonResponse {
  data: {
    token: string;
    expireTime: string;
    refreshToken: string;
  };
}

interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  certificationCode: string;
}

interface SignupResponse extends CommonResponse {
  data: null;
}

interface SendCertificationCodeRequest {
  email: string;
}

interface SendCertificationCodeResponse extends CommonResponse {
  email: string;
  certificationCode: string;
}

interface VerifyCertificationCodeRequest {
  email: string;
  certificationCode: string;
}

interface VerifyCertificationCodeResponse extends CommonResponse {
  data: null;
}

export {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SendCertificationCodeRequest,
  SendCertificationCodeResponse,
  VerifyCertificationCodeRequest,
  VerifyCertificationCodeResponse,
};
