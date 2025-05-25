export interface ApiResponse<T> {
    message: string;
    data?: T;
}
  
export interface UserInfo {
    userId: string;
    nickname: string;
    name: string;
    profileImageUrl: string;
}
    
export type UserInfoResponse = ApiResponse<UserInfo>;
    

  