import { getProfile } from '@/api/profile';
import useAuthStore from '@/store/auth.store';

export default function useAuth() {
  const authStore = useAuthStore();
  const getCurrentAccessToken = () => {
    return authStore.user?.token;
  };

  const isValidUser = async () => {
    if (!authStore.user?.token) {
      return false;
    }

    if (!authStore.loggedIn) {
      return false;
    }

    const profile = await getProfile();
    return !!profile.data;
  };

  return {
    getCurrentAccessToken,
    isValidUser,
  };
}
