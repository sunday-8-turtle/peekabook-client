import httpClient from '.';
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
  const res = await httpClient.put(url, body);
  return res.data;
};

const resetPassword = async (
  body: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const url = '/setting/password';
  const res = await httpClient.put(url, body);
  return res.data;
};

const getProfile = async (): Promise<Profile> => {
  const url = '/user';
  const res = await httpClient.get(url);
  return res.data;
};

const deleteAccount = async (): Promise<void> => {
  const url = '/user';
  await httpClient.delete(url);
};

export { resetNickname, resetPassword, getProfile, deleteAccount };
