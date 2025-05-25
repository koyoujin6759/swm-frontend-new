import { API_ENDPOINTS } from "../endpoints";
import axios from "axios";
import { ApiResponse, StudyApplyDetailResponse } from "@/types/api/study-recruit/getStudyApplyDetail";

export const getApplyStudyDetail = async (participationId: string): Promise<ApiResponse<StudyApplyDetailResponse>> => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${baseUrl}${API_ENDPOINTS.STUDY.APPLY_DETAIL(participationId)}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
