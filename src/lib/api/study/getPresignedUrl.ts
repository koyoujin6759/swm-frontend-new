import { API_ENDPOINTS } from '@/lib/api/endpoints';
import axios from 'axios';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif','bmp','webp','pdf'];

// 파일 확장자 검사 함수
const isValidFileExtension = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? ALLOWED_EXTENSIONS.includes(extension) : false;
}; 

export const getPresignedUrl = async (fileName: string, fileSize: number) => {
  if (!isValidFileExtension(fileName)) {
    throw new Error('지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, bmp, webp, pdf만 가능)');
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${API_ENDPOINTS.FILES.PRESIGNED_URL}`;

  // fileSize를 바이트 단위의 문자열로 변환
  const fileSizeInBytes = Math.floor(fileSize).toString();

  // console.log('파일 정보:', {
  //   fileName,
  //   fileSize: fileSizeInBytes,
  //   fileSizeInMB: (fileSize / (1024 * 1024)).toFixed(2) + 'MB'
  // });
  
  const params = new URLSearchParams({
    fileName: fileName,
    fileSize: fileSizeInBytes
  });
 
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      params
    });
    
    // console.log('Presigned URL 응답:', response.data);
    
    if (response.data.message === 'Expired Token') {
      throw new Error('TOKEN_EXPIRED');
    }
    
    if (!response.data || !response.data.data || !response.data.data.presignedUrl) {
      throw new Error('유효하지 않은 Presigned URL 응답');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Presigned URL 요청 실패:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.data?.message === 'Expired Token') {
        throw new Error('TOKEN_EXPIRED');
      }
    }
    throw error;
  }
};

// 파일 업로드 함수
export const uploadFileToPresignedUrl = async (file: File) => {
  try {
    const response = await getPresignedUrl(file.name, file.size);

    if (!response.data || !response.data.presignedUrl) {
      throw new Error('Presigned URL을 가져오는데 실패했습니다.');
    }

    // presigned URL로 파일 업로드
    await axios.put(response.data.presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    // 실제 이미지 URL 반환 (query string 제거)
    return response.data.presignedUrl.split('?')[0];
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    throw error;
  }
};
 