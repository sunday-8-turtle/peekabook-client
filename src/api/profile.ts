import { apiDelete, apiGet, apiPut } from './index';
import {
  ResetNicknameRequest,
  ResetPasswordRequest,
  ResetNicknameResponse,
  ResetPasswordResponse,
  Profile,
} from '@/types/profile.types';

const resetNickname = async (
  body: ResetNicknameRequest
): Promise<ResetNicknameResponse> => {
  const url = '/setting/nickname';
  const res = await apiPut(url, body);
  return res.data;
};

const resetPassword = async (
  body: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const url = '/setting/password';
  const res = await apiPut(url, body);
  return res.data;
};

const getProfile = async (): Promise<Profile> => {
  const url = '/user';
  const res = await apiGet(url);
  return res.data;
};

const deleteAccount = async (): Promise<void> => {
  const url = '/user';
  await apiDelete(url);
};

export { resetNickname, resetPassword, getProfile, deleteAccount };
