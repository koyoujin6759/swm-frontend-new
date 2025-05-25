'use client';

import { uploadFileToPresignedUrl } from '@/lib/api/study/getPresignedUrl';
import { postStudy } from '@/lib/api/study/postStudy';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  getCategoryList,
  getPositionOptions,
} from '@/types/api/study-recruit/study';
import { InputField } from '@/components/InputField';
import ImageUploader from '@/components/study-create/ui/image-uploader';
import PositionFieldGroup from '@/components/study-create/ui/position-field-group';
import RadioSelectGroup from '@/components/study-create/ui/radio-select-group'; 
import { useToastStore } from '@/store/useToastStore';
import type { CreateStudyRequest } from '@/types/api/study-recruit/postStudy';
interface PositionField {
  id: string;
  position: string;
  capacity: number | undefined;
}

export default function StudyCreate() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const methods = useForm();
  const { watch } = methods;
  const category = getCategoryList();
  const [previewImages, setPreviewImages] = useState<
    {
      url: string;
      width: number;
      height: number;
      name: string;
      file: File;
      size: number;
      imageId?: number;
    }[]
  >([]);

  const [positionFields, setPositionFields] = useState<PositionField[]>([
    { id: '1', position: 'ALL', capacity: undefined },
  ]);
 
  const { showToast } = useToastStore(); 

  const positionOptions = getPositionOptions();

  const [openSelects, setOpenSelects] = useState<Record<string, boolean>>({});

  const [tagList, setTagList] = useState<string[]>([]);

  const { mutate } = useMutation({
    mutationFn: (studyData: CreateStudyRequest) => postStudy(studyData),
    onSuccess: async (response) => {
      if (response.message === 'Expired Token') {
        showToast({
          message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        });
        router.push('/login');
        return;
      }

      showToast({
        message: '스터디 생성이 완료되었습니다.',
      });

      // 캐시 무효화 전에 지연 추가
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 스터디 목록 데이터만 갱신
      await queryClient.invalidateQueries({ 
        queryKey: ['study'],
        refetchType: 'none' // 자동 리패치 비활성화
      });

      // 목록 페이지로 즉시 이동
      router.push('/study-recruit');
    },
    onError: (error: unknown) => {
      console.error('생성 실패:', error);
      showToast({
        message: '스터디 생성에 실패했습니다.',
      });
    },
  });

  //필수입력값 유효성검사
  const formTitle = watch('title');
  const formContent = watch('content');
  const formOpenChatUrl = watch('openChatUrl');
  const formCategory = watch('category');

  const isFormValid =
    formTitle &&
    formContent &&
    formOpenChatUrl &&
    formCategory &&
    positionFields.length > 0 &&
    positionFields.every(
      (field: PositionField) =>
        field.position !== 'ALL' &&
        field.capacity !== undefined &&
        field.capacity > 0,
    );

  const handleCategoryChange = (value: string) => {
    methods.setValue('category', value);
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files) {
      const file = files[0];

      const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif','bmp','webp','pdf'];
      if(!ALLOWED_EXTENSIONS.includes(file.type.split('/')[1])) {
        showToast({
          message: '지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, bmp, webp, pdf만 가능)',
        });
        e.target.value = '';
        return;
      }

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
       

      // 기존 이미지 배열을 복사하고 새 이미지 추가
      const updatedPreviewImages = [
        ...previewImages,
        {
          url: imageUrl,
          width: 200,
          height: 200,
          name: file.name,
          size: file.size,
          file: file
        }
      ];

      // 상태 업데이트
      setPreviewImages(updatedPreviewImages);
 

      // imageFiles 업데이트
      const currentImageFiles = methods.getValues('imageFiles') || [];
      methods.setValue('imageFiles', [...currentImageFiles, file]);
    }
  };

  const handleOrderEdit = (
    newOrder: {
      url: string;
      width: number;
      height: number;
      name: string;
      size: number;
      imageId?: number;
    }[],
  ) => {
    const updatedOrder = newOrder.map((item) => ({
      ...item,
      file: previewImages.find((img) => img.url === item.url)?.file as File,
    }));
    setPreviewImages(updatedOrder);
    methods.setValue('image', updatedOrder);
  };

  const handleImageEdit = (
    oldUrl: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      const targetImage = previewImages.find((img) => img.url === oldUrl);
      if (targetImage) {
        URL.revokeObjectURL(targetImage.url);
      }

      const imageUrl = URL.createObjectURL(file);
      const newImage = {
        url: imageUrl,
        file: file,
        width: 200,
        height: 200,
        name: file.name,
        size: file.size,
      }; 
      setPreviewImages((prev) =>
        prev.map((img) => (img.url === oldUrl ? newImage : img)),
      );
      methods.setValue('image', [...previewImages, newImage]);
    }
  };

  const handleToggle = (fieldId: string) => {
    setOpenSelects((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handlePositionChange = (
    id: string,
    type: 'position' | 'capacity',
    value: string,
  ) => {
    const newPositions = positionFields.map((field) =>
      field.id === id
        ? {
            ...field,
            [type]: type === 'position' ? value || 'ALL' : parseInt(value) || 0,
          }
        : field,
    );
    setPositionFields(newPositions);
    methods.setValue('positions', newPositions);
  };

  const handleAddPosition = () => {
    setPositionFields((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        position: 'ALL',
        capacity: undefined,
      },
    ]);
  };

  const handleDeletePosition = (id: string) => {
    setPositionFields((prev) => prev.filter((field) => field.id !== id));
    methods.setValue(
      'positions',
      positionFields.filter((field) => field.id !== id),
    );
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

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const imagesToUpload = previewImages.filter((img) => img && img.file);

      const uploadedUrls = await Promise.all(
        imagesToUpload.map(async (img) => {
          if (!img.file) {
            throw new Error('파일이 존재하지 않습니다.');
          }
          try {
            return await uploadFileToPresignedUrl(img.file);
          } catch (error) {
            if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
              showToast({
                message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
                url: '/login',
                urlText: '로그인하러 가기',
              });
              router.push('/login');
              throw error;
            }
            throw error;
          }
        }),
      );

      const studyData = {
        title: data.title,
        content: data.content,
        openChatUrl: data.openChatUrl,
        category: data.category,
        tags: (data.tagList || [])
          .filter((tag: string) => tag && typeof tag === 'string')
          .map((tag: string) => (tag.startsWith('#') ? tag.slice(1) : tag)),
        imageUrls: uploadedUrls,
        createRecruitmentPositionRequests: (data.positions || []).map(
          (pos: PositionField) => ({
            title: pos.position,
            headcount: pos.capacity,
          }),
        ),
      };

      // console.log('create studyData', studyData);
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
        <h2 className="mb-[40px] text-2xl font-semibold">스터디 생성하기</h2>
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
                      imageId: image.imageId
                  }))}
                  msg="사진 별 권장 사이즈 및 용량 : 1장당 최대 크기 5MB)"
                  handleOrderEdit={handleOrderEdit}
                  handleImageEdit={handleImageEdit}
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <h3 className="font-semibold">모집 직무</h3>
                {[...positionFields].map(
                  (field: PositionField, index: number) => (
                    <PositionFieldGroup
                      key={field.id}
                      name="positions"
                      type="default"
                      value={field.position}
                      disabled={false}
                      capacity={field.capacity || 0}
                      onChange={(value) =>
                        handlePositionChange(
                          field.id,
                          'position',
                          value as string,
                        )
                      }
                      onCapacityChange={(value) =>
                        handlePositionChange(
                          field.id,
                          'capacity',
                          value.toString(),
                        )
                      }
                      options={positionOptions}
                      isOpen={openSelects[field.id] || false}
                      onToggle={() => handleToggle(field.id)}
                      isLastField={index === 0}
                      onAdd={handleAddPosition}
                      onDelete={() => handleDeletePosition(field.id)}
                      id={field.id}
                    />
                  ),
                )}
              </div>
              <button
                type="submit"
                className={`mt-[10px] h-[60px] w-full rounded-[8px] px-4 py-2 text-[16px] font-semibold text-white ${
                  !isFormValid ? 'bg-[#e0e0e0]' : 'bg-link-default'
                }`}
                disabled={!isFormValid}
              >
                스터디 생성 요청하기
              </button>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}
