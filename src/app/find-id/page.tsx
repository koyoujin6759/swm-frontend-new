'use client';

import { findId } from '@/lib/api/find-id';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { INPUT_ERROR_MESSAGE } from '@/utils/input-error-message';
import { InputField } from '@/components/InputField';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';

const findIdSchema = z.object({
  name: z.string({ required_error: INPUT_ERROR_MESSAGE.NAME.REQUIRED }),
  email: z.string({ required_error: INPUT_ERROR_MESSAGE.EMAIL.REQUIRED }),
});

export default function FindId() {
  const methods = useForm<z.infer<typeof findIdSchema>>({
    resolver: zodResolver(findIdSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting, isSubmitted },
  } = methods;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onSubmit = async (data: { name: string; email: string }) => {
    try {
      await findId(data.name, data.email);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Find ID error:', error);
      toast.error('아이디 찾기 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          mainText="이메일이 전송되었습니다."
          subText="이메일을 받지 못했다면 회원가입을 진행해 주세요."
          onClose={() => setIsModalOpen(false)}
          buttonText="회원가입 하러가기"
          path="/join"
        />
      )}
      <div className="flex h-[calc(100vh-70px)] items-center justify-center">
        <FormProvider {...methods}>
          <form className="mx-5 -mt-[70px] flex w-[432px] flex-col gap-10">
            <h1 className="text-2xl font-bold">아이디 찾기</h1>

            <section className="flex flex-col gap-5">
              <InputField
                name="name"
                label="이름"
                type="text"
                placeholder="이름을 입력해 주세요."
              />
              <InputField
                name="email"
                label="가입 시 이메일"
                type="email"
                placeholder="이메일을 입력해 주세요."
              />
            </section>

            <section className="flex flex-col gap-5">
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-blue-default"
                disabled={!isValid || isSubmitting || isSubmitted}
              >
                아이디 찾기
              </Button>
              <div className="flex justify-between px-10 text-sm text-gray-light">
                <Link href="/find-password">비밀번호 찾기</Link>
                <p>|</p>
                <Link href="/login">로그인</Link>
                <p>|</p>
                <Link href="/join">회원가입</Link>
              </div>
            </section>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
