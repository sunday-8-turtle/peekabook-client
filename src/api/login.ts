import { apiPost } from './index';
import { LoginRequest, LoginResponse } from '@/types/login.types';

async function login(body: LoginRequest): Promise<LoginResponse> {
  const LOGIN_URL = '/user';
  const res = await apiPost(LOGIN_URL, body);
  return res.data;
}

export { login };
