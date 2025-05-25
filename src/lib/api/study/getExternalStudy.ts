import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ExternalStudyResponse } from "@/types/api/external-study";
import axios from "axios";

export async function getExternalStudy(): Promise<ExternalStudyResponse> {
   
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${baseUrl}${API_ENDPOINTS.EXTERNAL_STUDY.LIST}`; 
        const res = await axios.get<ExternalStudyResponse>(url);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching study rooms:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}