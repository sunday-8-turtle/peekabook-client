interface CurrentUserState {
  token: string;
  refreshToken: string;
  expireTime: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  expireTime: string;
}

interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  certificationCode: string;
}

interface SignupResponse {
  data: null;
}

interface SendCertificationCodeRequest {
  email: string;
}

interface SendCertificationCodeResponse {
  email: string;
  certificationCode: string;
}

interface VerifyCertificationCodeRequest {
  email: string;
  certificationCode: string;
}

interface VerifyCertificationCodeResponse {
  data: null;
}

export {
  CurrentUserState,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SendCertificationCodeRequest,
  SendCertificationCodeResponse,
  VerifyCertificationCodeRequest,
  VerifyCertificationCodeResponse,
};
