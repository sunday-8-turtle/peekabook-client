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
}

interface SignupResponse extends CommonResponse {
  data: null;
}

interface SendEmailCertificateRequest {
  email: string;
}

interface SendEmailCertificateResponse extends CommonResponse {
  email: string;
  certificateCode: string;
}

interface VerifyEmailCertificateRequest {
  email: string;
  certificateCode: string;
}

interface VerifyEmailCertificateResponse extends CommonResponse {
  data: null;
}

export {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SendEmailCertificateRequest,
  SendEmailCertificateResponse,
  VerifyEmailCertificateRequest,
  VerifyEmailCertificateResponse,
};
