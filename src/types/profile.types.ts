interface CommonResponse {
  result: 'SUCCESS' | 'FAIL';
  message: string | null;
  errorCode: number | null;
  timestamp: string;
}

interface ResetNicknameRequest {
  nickname: string;
}

interface ResetPasswordRequest {
  password: string;
  beforePassword: string;
}

interface ResetNicknameResponse extends CommonResponse {
  data: null;
}

interface ResetPasswordResponse extends CommonResponse {
  data: null;
}

interface Profile {
  data: {
    id?: number;
    email: string;
    nickname: string;
    browserNoti?: boolean;
    emailNoti?: boolean;
  };
}

export {
  ResetNicknameRequest,
  ResetPasswordRequest,
  ResetNicknameResponse,
  ResetPasswordResponse,
  Profile,
};
