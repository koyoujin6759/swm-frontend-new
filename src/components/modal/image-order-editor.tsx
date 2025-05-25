'use client';

import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function SortableItem({
  image,
  handleDeleteImage,
  handleChangeImage,  
}: {
  image: {
    url: string;
    width: number;
    height: number;
    name: string;
    id: string;
  };
  handleDeleteImage: (url: string) => void;
  handleChangeImage: (oldUrl: string) => void;  
}) {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: image.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex w-full cursor-default items-center justify-between gap-[5px] border-t border-[#e0e0e0] bg-white py-[20px]"
      role="listitem"
    >
      <div className="flex w-full items-center justify-start gap-[16px]">
        <div className="relative h-[80px] w-[80px] flex-shrink-0 overflow-hidden">
          <Image
            src={image.url}
            alt="image"
            fill
            className="rounded-[8px] object-contain"
          />
        </div>
        <span className="max-w-[150px] truncate text-[14px] text-gray-600">
          {image.name}
        </span> 
      </div>
      <div className="flex items-center justify-center gap-[10px]">
          <button
            type="button"
            className="flex h-[24px] w-[24px] items-center justify-center"
            onClick={() => {
              handleChangeImage(image.url);
            }}
          >
            <Image src="/icons/Edit.svg" alt="수정" width={24} height={24} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-[10px]">
          <button
            type="button"
            className="flex h-[24px] w-[24px] items-center justify-center"
            onClick={() => {
              handleDeleteImage(image.url);
            }}
          >
            <Image src="/icons/Delete.svg" alt="삭제" width={24} height={24} />
          </button>
        </div>  
      <Image
        className="hidden"
        src="/icons/Menu.svg"
        alt="메뉴"
        width={24}
        height={24}
        {...attributes}
        {...listeners}
      />
    </div>
  );
}

export default function ImageOrderEditor({
  images,
  handleOrderEdit,
  handleCloseModal, 
}: {
  images: { 
    url: string; 
    width: number; 
    height: number; 
    name: string; 
    size: number;
  }[];
  handleOrderEdit: (
    newOrder: { 
      url: string; 
      width: number; 
      height: number; 
      name: string; 
      size: number;
    }[],
  ) => void;
  handleCloseModal: () => void;
  handleChangeImage: (oldUrl: string) => void;
}) {
  const [orderedImages, setOrderedImages] = useState(
    images.map((img, index) => ({
      ...img,
      id: `${img.url}-${index}`,
    })),
  );

  useEffect(() => {
    const updatedImages = images.map((img, index) => ({
      ...img,
      id: `${img.url}-${index}`,
    }));
    setOrderedImages(updatedImages);
  }, [images]);

  const handleDeleteImage = (urlToDelete: string) => {
    setOrderedImages(
      orderedImages.filter((image) => image.url !== urlToDelete),
    );
  };

  const handleModalImageChange = (oldUrl: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newUrl = URL.createObjectURL(file);
        setOrderedImages((prev) =>
          prev.map((image) =>
            image.url === oldUrl
              ? { ...image, url: newUrl, name: file.name }
              : image,
          ),
        );
      }
    };

    fileInput.click();
  };

  const handleConfirm = () => {
    handleOrderEdit(orderedImages);
    handleCloseModal();
  };

  return (
    <>
      <div className="fixed inset-0 left-1/2 top-1/2 z-20 flex h-[590px] w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[10px] overflow-hidden rounded-[8px] bg-white px-[50px] py-[40px]">
        <div className="flex h-full flex-col items-center justify-center gap-[30px]">
          <div className="flex flex-col items-center justify-center gap-[8px]">
            <h2 className="text-[20px] font-semibold text-black">
              이미지 편집
            </h2>
            <p className="font-regular text-[14px] text-gray-default">
              이미지를 편집 또는 삭제할 수 있습니다.
            </p>
          </div>
          <div className="w-full flex-1 overflow-y-auto">
            <DndContext
              onDragEnd={(event) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  const oldIndex = orderedImages.findIndex(
                    (img) => img.id === active.id,
                  );
                  const newIndex = orderedImages.findIndex(
                    (img) => img.id === over.id,
                  );
                  const newOrderedImages = arrayMove(
                    orderedImages,
                    oldIndex,
                    newIndex,
                  );
                  setOrderedImages(newOrderedImages);
                }
              }}
            >
              <SortableContext items={orderedImages.map((image) => image.id)}>
                {orderedImages.map((image) => (
                  <SortableItem
                    key={image.id}
                    image={image}
                    handleDeleteImage={handleDeleteImage}
                    handleChangeImage={handleModalImageChange}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <div className="flex w-full items-center justify-center gap-[10px]">
            <button
              type="button"
              className="h-[40px] w-[120px] flex-shrink-0 rounded-[4px] bg-[#E7F3FF] text-[14px] font-semibold text-link-default"
              onClick={handleCloseModal}
            >
              취소
            </button>
            <button
              type="button"
              className="h-[40px] flex-1 rounded-[4px] bg-link-default text-[14px] font-semibold text-white"
              onClick={handleConfirm}
            >
              변경
            </button>
          </div>
        </div>
      </div>
      <div
        className="fixed inset-0 z-10 bg-black/50"
        onClick={handleCloseModal}
      />
    </>
  );
}
