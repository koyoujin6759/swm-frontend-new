'use client';

import { editStudy } from '@/lib/api/study/editStudy';
import { uploadFileToPresignedUrl } from '@/lib/api/study/getPresignedUrl';
import { getStudyDetail } from '@/lib/api/study/getStudyDetail';
import { useToastStore } from '@/store/useToastStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getCategoryList } from '@/types/api/study-recruit/study';
import { InputField } from '@/components/InputField';
import ImageUploader from '@/components/study-create/ui/image-uploader';
import RadioSelectGroup from '@/components/study-create/ui/radio-select-group'; 
import { EditStudyRequest } from '@/types/api/study-recruit/editStudy';

export default function StudyRecruitEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const [tagList, setTagList] = useState<string[]>([]);
  const category = getCategoryList();

  const [previewImages, setPreviewImages] = useState<
    {
      url: string;
      width: number;
      height: number;
      name: string;
      size: number; 
    }[]
  >([]);

  const methods = useForm();
  const { watch } = methods;

  const { data: studyDetail } = useQuery({
    queryKey: ['study', 'studyDetail', params.id],
    queryFn: () => getStudyDetail(params.id as string),
  });

  useEffect(() => {
    if (studyDetail?.data) {
      const tags = (studyDetail.data.getTagResponses || [])
        .filter((tag: { tagId: number; name: string }) => tag && tag.name)
        .map((tag: { tagId: number; name: string }) =>
          tag.name.startsWith('#') ? tag.name : `#${tag.name}`,
        );
      const sortedImages = [...(studyDetail.data.getImageResponses || [])]
        .filter(
          (image: { imageId: number; imageUrl: string | null }) =>
            image.imageUrl,
        )
        .sort((a, b) => a.imageId - b.imageId);
      const imageUrlList = sortedImages.map(
        (image: { imageId: number; imageUrl: string | null }) =>
          image.imageUrl || '',
      );

      setTagList(tags);
      setPreviewImages(
        imageUrlList.map((url) => ({
          url: url,
          width: 200,
          height: 200,
          name: 'image',
          size: 0,
        })),
      );

      methods.reset({
        title: studyDetail.data.title,
        content: studyDetail.data.content,
        openChatUrl: studyDetail.data.openChatUrl,
        category: studyDetail.data.category,
        tags: studyDetail.data.getTagResponses.map(
          (tag: { name: string }) => tag.name,
        ),
        imageUrls: imageUrlList,
      });
    }
  }, [studyDetail, methods]);

  //필수입력값 유효성검사
  const formTitle = watch('title');
  const formContent = watch('content');
  const formOpenChatUrl = watch('openChatUrl');
  const formCategory = watch('category');

  const isFormValid =
    formTitle && formContent && formOpenChatUrl && formCategory;

  const handleCategoryChange = (value: string) => {
    methods.setValue('category', value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast({
          message: '이미지 크기는 5MB를 초과할 수 없습니다.',
        });
        e.target.value = '';
        return;
      }
      if (previewImages.length >= 10) {
        showToast({
          message: '이미지는 최대 10개까지만 추가할 수 있습니다.',
        });
        e.target.value = '';
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => [
        ...prev,
        {
          url: imageUrl,
          width: 200,
          height: 200,
          name: file.name,
          size: file.size,
        },
      ]);
      methods.setValue('imageFiles', [
        ...(methods.getValues('imageFiles') || []),
        file,
      ]);
    }
  };

  const handleOrderEdit = (
    newOrder: { url: string; width: number; height: number; name: string; size: number }[],
  ) => {
        // console.log('이미지 순서 변경:', newOrder.map(img => img.url));
    setPreviewImages(newOrder);
  };

  const handleImageEdit = (
    oldUrl: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // console.log('handleImageEdit 호출됨');
    const file = e.target.files?.[0];

    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif','bmp','webp','pdf'];
    if(!ALLOWED_EXTENSIONS.includes(file?.type?.split('/')[1] || '')) {
      showToast({
        message: '지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, bmp, webp, pdf만 가능)',
      });
      e.target.value = '';
      return;
    }

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast({
          message: '이미지 크기는 5MB를 초과할 수 없습니다.',
        });
        e.target.value = '';
        return;
      }
      if (previewImages.length >= 10) {
        showToast({
          message: '이미지는 최대 10개까지만 추가할 수 있습니다.',
        });
        e.target.value = '';
        return;
      }
      const targetImage = previewImages.find((img) => img.url === oldUrl);
      if (targetImage) {
        URL.revokeObjectURL(targetImage.url);
      }

      const imageUrl = URL.createObjectURL(file);
      const newImage = {
        url: imageUrl,
        width: 200,
        height: 200,
        name: file.name,
        size: file.size,
      };
      setPreviewImages((prev) =>
        prev.map((img) => (img.url === oldUrl ? newImage : img)),
      );

      const currentFiles = methods.getValues('imageFiles') || [];
      methods.setValue('imageFiles', [...currentFiles, file]);
    }
  };

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const tagValue = value.replace(',', '').trim();
      if (tagValue) {
        if (tagList.length >= 10) {
          showToast({
            message: '태그는 최대 10개까지만 입력할 수 있습니다.',
          });
          setInputValue('');
          return;
        }

        const newTag = tagValue.startsWith('#') ? tagValue : `#${tagValue}`;
        setTagList([...tagList, newTag]);
        methods.setValue(
          'tagList',
          [...tagList, newTag].map((tag) => tag.slice(1)),
        );
        setInputValue('');
      } else {
        setInputValue('');
      }
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValue.trim();
      if (!value) return;

      if (tagList.length >= 10) {
        showToast({
          message: '태그는 최대 10개까지만 입력할 수 있습니다.',
        });
        return;
      }

      const newTag = value.startsWith('#') ? value : `#${value}`;
      setTagList([...tagList, newTag]);
      methods.setValue(
        'tagList',
        [...tagList, newTag].map((tag) => tag.slice(1)),
      );
      setInputValue('');
    }
  };

  const handleTagDelete = (index: number) => {
    const newTags = [...tagList];
    newTags.splice(index, 1);

    const saveTags = (newTags || [])
      .filter((tag) => tag && typeof tag === 'string')
      .map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag));

    setTagList(newTags);
    methods.setValue('tagList', saveTags, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (newTags.length === 0) {
      const textarea = document.querySelector(
        'textarea[name="tagList"]',
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.lineHeight = '34px';
      }
    }
  };

  const { mutate } = useMutation({
    mutationFn: (studyData: EditStudyRequest ) => editStudy(params.id as string, studyData),
    onSuccess: async (response) => {
      if (response.message === 'Expired Token') {
        showToast({
          message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        });
        router.push('/login');
        return;
      }

      // console.log('생성 성공 응답:', response);

      await queryClient.invalidateQueries({
        queryKey: ['study', 'studyDetail', params.id],
      });

      showToast({
        message: '스터디 수정이 완료되었습니다.',
      });

      setTimeout(() => {
        router.push(`/study-recruit/${params.id}`);
      }, 500);
    },
    onError: ( ) => {
      showToast({
        message:  '스터디 수정에 실패했습니다.',
      });
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const originalTags = studyDetail?.data?.getTagResponses || [];
      const currentTags = data.tagList || [];
      const removedTagIds = originalTags
        .filter((tag: { tagId: number }) => !currentTags.includes(tag.tagId))
        .map((tag: { tagId: number }) => tag.tagId);

      let uploadedImageUrls: string[] = [];
      if (data.imageFiles && data.imageFiles.length > 0) {
        uploadedImageUrls = await Promise.all(
          data.imageFiles.map(async (file: File) => {
            const presignedUrl = await uploadFileToPresignedUrl(file);
            return presignedUrl;
          }),
        );
      } 
      
      const allImageUrls = previewImages
        .map((img) =>
          img.url.startsWith('blob:') ? uploadedImageUrls.shift() : img.url,
        )
        .filter((url) => url) as string[];
      // console.log('화면에 있는 이미지 urls:', allImageUrls);

      const addedImageUrls = allImageUrls.filter(
        (url) => !studyDetail?.data?.getImageResponses.some((image) => image.imageUrl === url),
      );
      // console.log('추가할 이미지 urls:', addedImageUrls);
 

      const serverImages = studyDetail?.data?.getImageResponses || [];
      const serverImageMap = new Map();
      serverImages.forEach(image => {
        if (image.imageUrl && image.imageId) {
          serverImageMap.set(image.imageUrl, image.imageId);
        }
      });
      
      // 2. 화면에 현재 표시된 이미지 URL 집합 생성
      const currentImageUrlSet = new Set(allImageUrls);
      
      // 3. 서버에 있지만 현재 화면에 없는 이미지만 삭제 목록에 추가
      const removedImageIds: number[] = [];
      serverImages.forEach(image => {
        if (image.imageUrl && image.imageId && !currentImageUrlSet.has(image.imageUrl)) {
          removedImageIds.push(image.imageId);
        }
      });
      
      // console.log('현재 화면 이미지 URLs:', Array.from(currentImageUrlSet));
      // console.log('서버 이미지:', serverImages);
      // console.log('삭제할 이미지 ids:', removedImageIds);

      const studyData = {
        title: data.title,
        content: data.content,
        openChatUrl: data.openChatUrl,
        category: data.category,
        modifyTagRequest: {
          tagsToAdd: data.tagList || [],
          tagIdsToRemove: removedTagIds,
        },
        modifyImageRequest: {
          imageUrlsToAdd: addedImageUrls,
          imageIdsToRemove: removedImageIds,
        },
      };

      // console.log('전송 데이터:', studyData);
      // console.log('이미지 요청 데이터:', JSON.stringify(studyData.modifyImageRequest, null, 2));
      // console.log('현재 이미지 URLs:', allImageUrls);
      // console.log('삭제할 이미지 IDs:', removedImageIds);

      mutate(studyData);
    } catch (error) {
      if (error instanceof Error && error.message !== 'TOKEN_EXPIRED') {
        console.error('이미지 업로드 실패:', error);
        showToast({
          message: '이미지 업로드에 실패했습니다.',
        });
      }

      if (error instanceof Error && error.message.includes('지원하지 않는 파일 형식')) {
        showToast({
          message: '지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, bmp, webp, pdf만 가능)',
        });
        return;
      }
      throw error;
    }
  });

  return (
    <>
      <section className="mx-auto max-w-screen-xl px-5 pb-[110px] pt-10 xl:px-0">
        <h2 className="mb-[40px] text-center text-2xl font-semibold">스터디 수정하기</h2>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-[30px]">
              <InputField
                name="title"
                label="제목"
                type="text"
                placeholder="제목을 입력해 주세요. (최대 20자)"
              />
              <InputField
                name="content"
                label="스터디 내용"
                type="text"
                placeholder="어떤 스터디인지 설명해 주세요."
              />
              <InputField
                name="openChatUrl"
                label="오픈채팅 URL"
                type="text"
                placeholder="스터디 활동 시 사용할 오픈채팅 URL을 입력해 주세요."
              />
              <RadioSelectGroup
                label="카테고리"
                subLabel="1개의 카테고리를 선택해 주세요."
                name="category"
                options={category}
                onOptionChange={(value) => handleCategoryChange(value)}
                value={methods.watch('category') || ''}
              />
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  <h3 className="font-semibold">태그 추가</h3>
                  <span className="text-[12px] text-[#bbb]">
                    컴마(,)로 구분해 주세요. (ex. #태그1,#태그2,#태그3,...)
                  </span>
                </div>
                <div className="box-border min-h-[60px] rounded-lg border border-[#e0e0e0] px-[16px] py-[13px]">
                  <div className="flex flex-wrap gap-1">
                    {tagList.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center rounded-[4px] bg-[#eee] px-2 py-1 text-[16px] font-medium text-[#a5a5a5]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagDelete(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <Image
                            src="/icons/Clear-gray.svg"
                            alt="태그삭제"
                            width={18}
                            height={18}
                          />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        tagList.length === 0
                          ? '#태그를 입력해 주세요. (최대 10개)'
                          : ''
                      }
                      className="min-w-[100px] flex-grow border-none text-[16px] leading-[34px] outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  <h3 className="font-semibold">이미지</h3>
                  <span className="text-[12px] text-[#bbb]">
                    스터디에 관련된 이미지를 추가해 주세요.
                  </span>
                </div>
                <ImageUploader
                  name="image"
                  onImageChange={handleImageChange}
                  previewImages={previewImages.map((image) => ({
                    url: image.url,
                    width: image.width,
                    height: image.height,
                    name: image.name,
                    size: image.size,  
                  }))}
                  msg="사진 별 권장 사이즈 및 용량 : 1장당 최대 크기 5MB"
                  handleOrderEdit={handleOrderEdit}
                  handleImageEdit={handleImageEdit}
                />
              </div>
              <button
                type="submit"
                className={`mt-[10px] h-[60px] w-full rounded-[8px] px-4 py-2 text-[16px] font-semibold text-white ${
                  !isFormValid ? 'bg-[#e0e0e0]' : 'bg-link-default'
                }`}
                disabled={!isFormValid}
              >
                스터디 수정하기
              </button>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}
