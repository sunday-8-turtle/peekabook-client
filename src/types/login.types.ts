interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  result: string;
  data: {
    token: string;
    expireTime: string;
    refreshToken: string;
  };
  message: string;
  errorCode: string;
  timestamp: string;
}

export { LoginRequest, LoginResponse };
