'use client';

import {
  checkAuthCode,
  checkEmail,
  checkNickname,
  createUser,
  sendAuthCode,
} from '@/lib/api/user-management/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { INPUT_ERROR_MESSAGE } from '@/utils/input-error-message';
import { User } from '@/types/api/user';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';

const signupSchema = z
  .object({
    name: z
      .string({ required_error: INPUT_ERROR_MESSAGE.NAME.REQUIRED })
      .min(2, INPUT_ERROR_MESSAGE.NAME.HELPER_TEXT)
      .regex(/^[가-힣a-zA-Z\s]+$/, INPUT_ERROR_MESSAGE.NAME.HELPER_TEXT),
    nickName: z
      .string({ required_error: INPUT_ERROR_MESSAGE.NICKNAME.REQUIRED })
      .regex(/^[a-zA-Z0-9]+$/, INPUT_ERROR_MESSAGE.NICKNAME.HELPER_TEXT),
    email: z
      .string({ required_error: INPUT_ERROR_MESSAGE.EMAIL.REQUIRED })
      .email(INPUT_ERROR_MESSAGE.EMAIL.INVALID_FORMAT),
    authCode: z
      .string({ required_error: INPUT_ERROR_MESSAGE.AUTH_CODE.REQUIRED })
      .regex(/^\d*$/, INPUT_ERROR_MESSAGE.AUTH_CODE.ONLY_NUMBER)
      .length(6, INPUT_ERROR_MESSAGE.AUTH_CODE.LENGTH),
    password: z
      .string({ required_error: INPUT_ERROR_MESSAGE.PASSWORD.REQUIRED })
      .min(8, INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT)
      .max(20, INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT)
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,20}$/,
        INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT,
      ),
    passwordCheck: z.string({
      required_error: INPUT_ERROR_MESSAGE.PASSWORD_CHECK,
    }),
    authCodeVerified: z.boolean().default(false),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: INPUT_ERROR_MESSAGE.PASSWORD_CHECK,
    path: ['passwordCheck'],
  });

export default function Join() {
  const router = useRouter();
  const methods = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const {
    watch,
    setError,
    setValue,
    formState: { errors, isValid },
  } = methods;
  const [nicknameHelperText, setNicknameHelperText] = useState<string>(
    INPUT_ERROR_MESSAGE.NICKNAME.HELPER_TEXT,
  );
  const [emailHelperText, setEmailHelperText] = useState<string>('');
  const [authCodeHelperText, setAuthCodeHelperText] = useState<string>('');
  const [authCodeButtonText, setAuthCodeButtonText] =
    useState<string>('인증번호 받기');
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isAuthCodeInputEnabled, setIsAuthCodeInputEnabled] =
    useState<boolean>(false);

  const nickname = watch('nickName');
  const email = watch('email');

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    const nickname = methods.getValues('nickName');

    try {
      const isAvailable = await checkNickname(nickname);

      if (isAvailable.data) {
        setError('nickName', { message: '이미 사용 중인 닉네임입니다.' });
        setIsNicknameChecked(false);
      } else {
        setNicknameHelperText('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      }
    } catch (error) {
      console.error('Nickname check error:', error);
      toast.error('닉네임 확인 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
      setIsNicknameChecked(false);
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    const email = methods.getValues('email');

    try {
      const isAvailable = await checkEmail(email);

      if (isAvailable.data) {
        setError('email', { message: '이미 사용 중인 이메일입니다.' });
        setIsEmailChecked(false);
      } else {
        setEmailHelperText('사용 가능한 이메일입니다.');
        setIsEmailChecked(true);
      }
    } catch (error) {
      console.error('Email check error:', error);
      toast.error('이메일 확인 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
      setIsEmailChecked(false);
    }
  };

  // 인증번호 전송
  const handleSendAuthCode = async () => {
    const email = methods.getValues('email');

    try {
      await sendAuthCode(email);
      setAuthCodeHelperText('이메일로 인증번호를 발송했습니다.');
      setAuthCodeButtonText('인증번호 재전송');
      setIsAuthCodeInputEnabled(true);
    } catch (error) {
      console.error('Auth code send error:', error);
      toast.error('인증번호 전송 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
    }
  };

  // 인증번호 검증
  const handleAuthCodeCheck = async () => {
    const email = methods.getValues('email');
    const authCode = methods.getValues('authCode');

    try {
      if (!errors.authCode) {
        const response = await checkAuthCode(email, authCode);

        if (response.data) {
          setAuthCodeHelperText(INPUT_ERROR_MESSAGE.AUTH_CODE.VALID);
          setValue('authCodeVerified', true);
        } else {
          setAuthCodeHelperText('');
          setError('authCode', {
            message: INPUT_ERROR_MESSAGE.AUTH_CODE.INVALID,
          });
          setValue('authCodeVerified', false);
        }
      }
    } catch (error) {
      console.error('Auth code check error:', error);
      toast.error('인증번호 확인 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
    }
  };

  // 회원가입
  const handleCreateUser = async () => {
    const { nickName, password, name, email, authCodeVerified } =
      methods.getValues();

    if (!isNicknameChecked) {
      setError('nickName', { message: '닉네임 중복 확인이 필요합니다.' });
      return;
    }

    if (!authCodeVerified) {
      setError('authCode', { message: '인증번호 확인이 필요합니다.' });
      return;
    }

    const user: User = {
      nickname: nickName,
      password: password,
      name: name,
      loginId: email,
    };

    try {
      await createUser(user);
      router.push(`/join/complete?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('User create error:', error);
      toast.error('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        duration: 3000,
      });
    }
  };

  // 닉네임이 변경되면 닉네임 체크 상태 초기화
  useEffect(() => {
    setIsNicknameChecked(false);
    setNicknameHelperText(INPUT_ERROR_MESSAGE.NICKNAME.HELPER_TEXT);
  }, [nickname]);

  // 이메일이 변경되면 이메일 체크 상태 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    setEmailHelperText('');
  }, [email]);

  return (
    <div className="m-16 flex items-center justify-center">
      <FormProvider {...methods}>
        <form className="mx-5 flex w-[432px] flex-col gap-10">
          <h1 className="text-2xl font-bold">스터디 윗 미 회원가입</h1>

          <section className="flex flex-col gap-5">
            <InputField
              name="name"
              label="이름"
              type="text"
              placeholder="이름을 입력해 주세요."
              helperText={INPUT_ERROR_MESSAGE.NAME.HELPER_TEXT}
            />
            <InputField
              name="nickName"
              label="닉네임"
              type="text"
              placeholder="닉네임을 입력해 주세요."
              helperText={nicknameHelperText}
              buttonText="중복 확인"
              onButtonClick={handleCheckNickname}
              buttonDisabled={
                !nickname || !!errors.nickName || isNicknameChecked
              }
            />
            <InputField
              name="email"
              label="이메일"
              type="text"
              placeholder="ex)studywithme@gmail.com"
              helperText={emailHelperText}
              buttonText="중복 확인"
              onButtonClick={handleCheckEmail}
              buttonDisabled={!email || !!errors.email || isEmailChecked}
            />
            <InputField
              name="authCode"
              label="인증번호 입력"
              type="text"
              placeholder="6자리 인증번호"
              helperText={authCodeHelperText}
              maxLength={6}
              buttonText={authCodeButtonText}
              onButtonClick={handleSendAuthCode}
              buttonDisabled={!isEmailChecked}
              inputDisabled={!isAuthCodeInputEnabled}
              onAuthCodeCheck={handleAuthCodeCheck}
            />
            <InputField
              name="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              helperText={INPUT_ERROR_MESSAGE.PASSWORD.HELPER_TEXT}
            />
            <InputField
              name="passwordCheck"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
            />
          </section>
          <Button
            type="button"
            className="bg-blue-default"
            disabled={!isValid}
            onClick={handleCreateUser}
          >
            가입하기
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
