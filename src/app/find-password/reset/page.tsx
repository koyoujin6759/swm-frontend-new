'use client';

import { resetPassword } from '@/lib/api/user-management/password-recovery';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { INPUT_ERROR_MESSAGE } from '@/utils/input-error-message';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';

const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: INPUT_ERROR_MESSAGE.PASSWORD.REQUIRED,
      })
      .min(8, INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT)
      .max(20, INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT)
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,20}$/,
        INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT,
      ),
    passwordCheck: z.string({
      required_error: INPUT_ERROR_MESSAGE.PASSWORD.REQUIRED,
    }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: INPUT_ERROR_MESSAGE.PASSWORD_CHECK,
    path: ['passwordCheck'],
  });

function EmailFetcher({
  onEmailFetched,
}: {
  onEmailFetched: (email: string) => void;
}) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  if (email) {
    onEmailFetched(email);
  }
  return null;
}

export default function ResetPassword() {
  const methods = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting, isSubmitted },
  } = methods;

  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    const password = methods.getValues('password');

    if (!email) {
      console.error('Email is not provided');
      return;
    }

    try {
      await resetPassword(email, password);
      router.push('/find-password/complete');
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-70px)] items-center justify-center">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-5 -mt-[70px] flex w-[432px] flex-col gap-10"
        >
          <h1 className="text-2xl font-bold">비밀번호 재설정</h1>

          <section className="flex flex-col gap-2">
            <InputField
              name="password"
              label="새로운 비밀번호를 입력해 주세요."
              type="password"
              placeholder="신규 비밀번호"
              helperText={INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT}
            />
            <InputField
              name="passwordCheck"
              type="password"
              placeholder="신규 비밀번호 확인"
            />
          </section>

          <section className="flex flex-col gap-5">
            <Button
              className="bg-blue-default"
              disabled={!isValid || isSubmitting || isSubmitted}
            >
              비밀번호 재설정하기
            </Button>
            <div className="flex justify-between px-10 text-sm text-gray-light">
              <Link href="/find-id">아이디 찾기</Link>
              <p>|</p>
              <Link href="/login">로그인</Link>
              <p>|</p>
              <Link href="/join">회원가입</Link>
            </div>
          </section>
        </form>
      </FormProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <EmailFetcher onEmailFetched={setEmail} />
      </Suspense>
    </div>
  );
}
