import Image from 'next/image';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ImageOrderEditor from '@/components/modal/image-order-editor';
import { Input } from '@/components/ui/input';

export default function ImageUploader({
  name,
  onImageChange,
  previewImages,
  msg,
  handleOrderEdit,
  handleImageEdit,
}: {
  name: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImages?: {
    url: string;
    width: number;
    height: number;
    name: string; 
    size: number;
  }[];
  msg?: string;
  handleOrderEdit: (
    newOrder: { url: string; width: number; height: number; name: string; size: number; }[],
  ) => void;
  handleImageEdit: (
    oldUrl: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  const { control } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleChangeImage = (oldUrl: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    const handleChange = (e: Event) => {
      const changeEvent = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageEdit(oldUrl, changeEvent);
      fileInput.removeEventListener('change', handleChange);
    };

    fileInput.addEventListener('change', handleChange);
    fileInput.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name={name}
          render={() => (
            <div className="flex flex-wrap items-end justify-start gap-[10px]">
              {previewImages?.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative h-[116px] w-[116px] overflow-hidden rounded-[8px] border border-[#e0e0e0]"
                >
                  <Image
                    src={imageUrl.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
              <label
                htmlFor="file-upload"
                className="flex h-[116px] w-[116px] cursor-pointer items-center justify-center rounded-[8px] border border-[#e0e0e0] bg-[#f9f9f9]"
              >
                <Image
                  src="/icons/Plus.svg"
                  alt="Plus"
                  width={24}
                  height={24}
                />
              </label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                multiple
                className="hidden"
              />
              <div>
                {previewImages && previewImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                    className="h-[60px] w-[116px] rounded-[8px] border border-[#E0E0E0] bg-[#F9F9F9] text-center text-[16px] font-semibold text-[#6e6e6e]"
                  >
                    이미지 편집
                  </button>
                )}
              </div>
            </div>
          )}
        />
        {msg && (
          <span className="font-regular text-[14px] text-red-error">{msg}</span>
        )}
      </div>
      {isModalOpen && (
        <ImageOrderEditor
          images={
            previewImages?.map((image) => ({
              ...image,
              name: image.url.split('/').pop() || '',
            })) || []
          }
          handleOrderEdit={handleOrderEdit}
          handleCloseModal={handleCloseModal}
          handleChangeImage={handleChangeImage}
        />
      )}
    </div>
  );
}
