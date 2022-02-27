import httpClient from '.';
import { PKBResponse } from '@/types';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SendCertificationCodeRequest,
  SendCertificationCodeResponse,
  VerifyCertificationCodeRequest,
  VerifyCertificationCodeResponse,
} from '@/types/auth.types';

async function login(body: LoginRequest): Promise<PKBResponse<LoginResponse>> {
  const LOGIN_URL = '/user/login';
  const res = await httpClient.post(LOGIN_URL, body);
  return res.data;
}

async function signup(
  body: SignupRequest
): Promise<PKBResponse<SignupResponse>> {
  const SIGNUP_URL = '/user/signup';
  const res = await httpClient.post(SIGNUP_URL, body);
  return res.data;
}

async function sendCertificationCode(
  body: SendCertificationCodeRequest
): Promise<PKBResponse<SendCertificationCodeResponse>> {
  const SEND_EMAIL_CERTIFICATE_URL = '/user/email/send';
  const res = await httpClient.post(SEND_EMAIL_CERTIFICATE_URL, body);
  return res.data;
}

async function verifyCertificationCode(
  body: VerifyCertificationCodeRequest
): Promise<PKBResponse<VerifyCertificationCodeResponse>> {
  const VERIFY_EAMIL_CERTIFICATE_URL = '/user/email/certification';
  const res = await httpClient.post(VERIFY_EAMIL_CERTIFICATE_URL, body);
  return res.data;
}

export { login, signup, sendCertificationCode, verifyCertificationCode };
