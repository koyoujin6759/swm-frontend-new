'use client';

import {
  checkPasswordAuthCode,
  sendPasswordAuthCode,
} from '@/lib/api/user-management/password-recovery';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { INPUT_ERROR_MESSAGE } from '@/utils/input-error-message';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';

const findPasswordSchema = z.object({
  name: z.string({ required_error: INPUT_ERROR_MESSAGE.NAME.REQUIRED }),
  joinEmail: z
    .string({ required_error: INPUT_ERROR_MESSAGE.EMAIL.REQUIRED })
    .email(INPUT_ERROR_MESSAGE.EMAIL.INVALID_FORMAT),
  findPasswordAuthCode: z
    .string({
      required_error: INPUT_ERROR_MESSAGE.AUTH_CODE.REQUIRED,
    })
    .regex(/^\d*$/, INPUT_ERROR_MESSAGE.AUTH_CODE.ONLY_NUMBER)
    .length(6, INPUT_ERROR_MESSAGE.AUTH_CODE.LENGTH),
  authCodeVerified: z.boolean().default(false),
});

export default function FindPassword() {
  const methods = useForm<z.infer<typeof findPasswordSchema>>({
    resolver: zodResolver(findPasswordSchema),
    mode: 'onBlur',
  });

  const {
    watch,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting, isSubmitted },
    getValues,
  } = methods;

  const router = useRouter();

  const [joinEmailButtonText, setJoinEmailButtonText] =
    useState<string>('인증번호 받기');
  const [authCodeHelperText, setAuthCodeHelperText] = useState<string>('');
  const [isAuthCodeInputEnabled, setIsAuthCodeInputEnabled] =
    useState<boolean>(false);

  const email = watch('joinEmail');
  const authCode = watch('findPasswordAuthCode');
  const authCodeVerified = watch('authCodeVerified');

  useEffect(() => {
    if (email) {
      setJoinEmailButtonText('인증번호 받기');
    }
  }, [email]);

  const handleSendAuthCode = async () => {
    const email = methods.getValues('joinEmail');

    try {
      await sendPasswordAuthCode(email);
      setAuthCodeHelperText('이메일로 인증번호를 발송했습니다.');
      setJoinEmailButtonText('인증번호 재전송');
      setValue('authCodeVerified', false);
      setIsAuthCodeInputEnabled(true);
    } catch (error) {
      console.error('Auth code send error:', error);
      toast.error('인증번호 전송 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
    }
  };

  const handleAuthCodeCheck = async () => {
    const email = methods.getValues('joinEmail');
    const authCode = methods.getValues('findPasswordAuthCode');

    try {
      const response = await checkPasswordAuthCode(email, authCode);

      if (response.data) {
        setAuthCodeHelperText(INPUT_ERROR_MESSAGE.AUTH_CODE.VALID);
        setIsAuthCodeInputEnabled(false);
        setValue('authCodeVerified', true);
      } else {
        setAuthCodeHelperText('');
        setError('findPasswordAuthCode', {
          message: INPUT_ERROR_MESSAGE.AUTH_CODE.INVALID,
        });
        setValue('authCodeVerified', false);
      }
    } catch (error) {
      console.error('Auth code check error:', error);
      toast.error('인증번호 확인 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-70px)] items-center justify-center">
      <FormProvider {...methods}>
        <form className="mx-5 -mt-[70px] flex w-[432px] flex-col gap-10">
          <h1 className="text-2xl font-bold">비밀번호 찾기</h1>

          <section className="flex flex-col gap-5">
            <InputField
              name="name"
              label="이름"
              type="text"
              placeholder="이름을 입력해 주세요."
            />
            <InputField
              name="joinEmail"
              label="가입 시 이메일"
              type="email"
              placeholder="이메일을 입력해 주세요."
              buttonText={joinEmailButtonText}
              onButtonClick={handleSendAuthCode}
              buttonDisabled={!email || !!errors.joinEmail}
            />
            <InputField
              name="findPasswordAuthCode"
              label="인증번호 입력"
              type="text"
              maxLength={6}
              placeholder="6자리 인증번호"
              helperText={authCodeHelperText}
              buttonText="확인"
              onButtonClick={handleAuthCodeCheck}
              buttonDisabled={
                !authCode ||
                !!errors.findPasswordAuthCode ||
                !isAuthCodeInputEnabled
              }
              inputDisabled={!isAuthCodeInputEnabled}
            />
          </section>

          <section className="flex flex-col gap-5">
            <Button
              className="bg-blue-default"
              type="button"
              onClick={() =>
                router.push(
                  `/find-password/reset?email=${encodeURIComponent(getValues('joinEmail'))}`,
                )
              }
              disabled={
                !isValid || isSubmitting || !authCodeVerified || isSubmitted
              }
            >
              확인
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
    </div>
  );
}
