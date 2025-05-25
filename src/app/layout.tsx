import type { Metadata } from "next";
import localFont from "next/font/local";
import RootProvider from "@/providers/root-provider";
import "@/styles/globals.css";
import Header from "@/components/Header";     
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ui/ToastContainer";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: 'swap',
  variable: "--font-pretendard",
  weight: "50 900",
}); 

export const metadata: Metadata = {
  title: 'Study With Me',
  description: 'Study With Me Platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode;  
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} antialiased`}
      >
        <RootProvider>
          <Toaster
            toastOptions={{
              style: {
                maxWidth: '500px',
                width: '100%',
              }
            }}
          />
          <ToastContainer />
          <Header />
          {children}  
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
