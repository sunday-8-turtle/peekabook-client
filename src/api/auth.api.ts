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
  CheckDuplicateEmailRequest,
  CheckDuplicateEmailResponse,
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

/**
 * 이메일 인증번호 전송
 */
async function sendCertificationCode(
  body: SendCertificationCodeRequest
): Promise<PKBResponse<SendCertificationCodeResponse>> {
  const SEND_EMAIL_CERTIFICATE_URL = '/user/email/send';
  const res = await httpClient.post(SEND_EMAIL_CERTIFICATE_URL, body);
  return res.data;
}

/**
 * 이메일 인증번호 확인
 */
async function verifyCertificationCode(
  body: VerifyCertificationCodeRequest
): Promise<PKBResponse<VerifyCertificationCodeResponse>> {
  const VERIFY_EAMIL_CERTIFICATE_URL = '/user/email/certification';
  const res = await httpClient.post(VERIFY_EAMIL_CERTIFICATE_URL, body);
  return res.data;
}

/**
 * 중복 이메일 확인
 */
async function checkDuplicateEmail(
  body: CheckDuplicateEmailRequest
): Promise<PKBResponse<CheckDuplicateEmailResponse>> {
  const CHECK_DUPLICATE_EMAIL_URL = '/user/email/duplicate';
  const res = await httpClient.post(CHECK_DUPLICATE_EMAIL_URL, body);
  return res.data;
}

export {
  login,
  signup,
  sendCertificationCode,
  verifyCertificationCode,
  checkDuplicateEmail,
};
