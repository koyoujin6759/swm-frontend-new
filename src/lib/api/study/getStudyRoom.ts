import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {   StudyRoomResponse } from "@/types/api/study-rooms";
import axios from "axios";

export async function getStudyRoom(): Promise<StudyRoomResponse> {
   
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${baseUrl}${API_ENDPOINTS.STUDY_ROOM.LIST}`; 
        const res = await axios.get<StudyRoomResponse>(url);
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