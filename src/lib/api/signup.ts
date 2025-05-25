import { User } from "@/types/api/user";
import { axiosInstance } from "./axios";
import { API_ENDPOINTS } from "./endpoints";

export const checkNickname = async (nickname: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.USER.CHECK_NICKNAME, {
          params: { nickname: nickname }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkEmail = async (email: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.USER.CHECK_EMAIL, {
            params: { loginId: email }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const sendAuthCode = async (email: string) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.USER.SEND_AUTH_CODE, {
            loginId: email
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const checkAuthCode = async (email: string, authCode: string) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.USER.CHECK_AUTH_CODE, {
            loginId: email,
            authCode: authCode
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createUser = async (user: User) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE, user);

        return response.data;
    } catch (error) {
        throw error;
    }
}
