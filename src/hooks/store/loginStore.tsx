import { create } from 'zustand';

export type MemberPermission = 'MASTER' | 'MANAGER' | 'AGENCY' | 'SELLER' | '';
export type trafficType = 'PLACE' | 'SHOP';

interface UserInfoState {
  userInfo: {
    loginId: string;
    memberPermission: MemberPermission;
    trafficTypes: trafficType[];
  };
  setUserInfo: (userInfo: {
    loginId: string;
    memberPermission: MemberPermission;
    trafficTypes: trafficType[];
  }) => void;
}

// 유저 정보 스토어
const userStore = create<UserInfoState>((set) => ({
  userInfo: {
    loginId: '',
    memberPermission: '',
    trafficTypes: [],
  },
  setUserInfo: ({
    loginId,
    memberPermission,
    trafficTypes,
  }: {
    loginId: string;
    memberPermission: MemberPermission;
    trafficTypes: trafficType[];
  }) => set({ userInfo: { loginId, memberPermission, trafficTypes } }),
}));

export { userStore };
