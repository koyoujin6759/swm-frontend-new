'use client'

import jwt from 'jsonwebtoken';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { InputField } from "@/components/InputField"
import { login } from "@/lib/api/auth"
import { isApiErrorResponse } from "@/types/common"
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { INPUT_ERROR_MESSAGE } from '@/utils/input-error-message';
import { useQueryClient } from '@tanstack/react-query';

const loginSchema = z.object({
  email: z.string({required_error: INPUT_ERROR_MESSAGE.EMAIL.REQUIRED}).email(INPUT_ERROR_MESSAGE.EMAIL.INVALID_FORMAT),
  password: z.string({required_error: INPUT_ERROR_MESSAGE.PASSWORD.REQUIRED}),
})

export default function Login() {
  const methods = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {handleSubmit, reset, setError, watch, formState: {isValid, isSubmitting}} = methods;
  const router = useRouter();

  const email = watch('email');
  const password = watch('password');

  const queryClient = useQueryClient();

  const onSubmit = async (data: {email: string, password: string}) => {
    try {
      const response = await login(data.email, data.password);
      if (response.status === 200) {
        const accessToken = response.headers['authorization'].split(' ')[1];
        const decodedToken = jwt.decode(accessToken) as { exp: number };
        const expirationTime = new Date(decodedToken.exp * 1000).toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace('T', ' ');
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('expirationTime', expirationTime);
        window.dispatchEvent(new Event('login'));
        await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
        router.push('/');
      }
    } catch (error) {
      if (isApiErrorResponse(error)) {
        if (error.message === 'User not found') {
          reset({email: '', password: ''});
          setError("email", { type: "manual", message: "해당 이메일의 아이디가 존재하지 않습니다." });
        } else if (error.message === 'Password mismatch') {
          reset((fromValue) => ({...fromValue, password: ''}));
          setError("password", { type: "manual", message: "비밀번호가 일치하지 않습니다. 다시 입력해 주세요." });
        }
      }
    }
  }

  return (
  <div className='flex justify-center items-center' style={{ height: 'calc(100vh - 70px)' }}>
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-[432px] mx-5 gap-10'>
        <h1 className='text-2xl font-bold'>스터디 윗 미 로그인</h1>

        <section className='flex flex-col gap-5'>
          <InputField
            name="email"
            label="아이디"
            type="email"
            placeholder="아이디를 입력해 주세요."
            helperText='ex) studywithme@gmail.com'
          />
          <InputField
            name="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
          />
          <div className='flex items-center gap-2'>
            <Checkbox id="remember" />
            <label htmlFor="remember" className='text-sm text-gray-light'>로그인 유지</label>
          </div>
        </section>

        <section className='flex flex-col gap-5'>
          <Button
            className='bg-blue-default'
            type="submit"
            disabled={!isValid || !email || !password || isSubmitting}
          >
            로그인
          </Button>
          <div className='flex justify-between px-10 text-gray-light text-sm'>
            <Link href='/find-id'>아이디 찾기</Link>
            <p>|</p>
            <Link href='/find-password'>비밀번호 찾기</Link>
            <p>|</p>
            <Link href='/join'>회원가입</Link>
          </div>
        </section>
      </form>
    </FormProvider>
  </div>
  );
}
