import { apiPost } from './index';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SendCertificationCodeRequest,
  SendCertificationCodeResponse,
  VerifyCertificationCodeRequest,
  VerifyCertificationCodeResponse,
} from '@/types/login.types';

async function login(body: LoginRequest): Promise<LoginResponse> {
  const LOGIN_URL = '/user';
  const res = await apiPost(LOGIN_URL, body);
  return res.data;
}

async function signup(body: SignupRequest): Promise<SignupResponse> {
  const SIGNUP_URL = '/user/signup';
  const res = await apiPost(SIGNUP_URL, body);
  return res.data;
}

async function sendCertificationCode(
  body: SendCertificationCodeRequest
): Promise<SendCertificationCodeResponse> {
  const SEND_EMAIL_CERTIFICATE_URL = '/user/email/send';
  const res = await apiPost(SEND_EMAIL_CERTIFICATE_URL, body);
  return res.data;
}

async function verifyCertificationCode(
  body: VerifyCertificationCodeRequest
): Promise<VerifyCertificationCodeResponse> {
  const VERIFY_EAMIL_CERTIFICATE_URL = '/user/email/certification';
  const res = await apiPost(VERIFY_EAMIL_CERTIFICATE_URL, body);
  return res.data;
}

export { login, signup, sendCertificationCode, verifyCertificationCode };
