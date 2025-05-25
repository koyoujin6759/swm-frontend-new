import Image from 'next/image';
import Link from 'next/link';

export default function Toast({
  isToast,
  message,
  url,
  urlText,
  active,
  icon,
}: {
  isToast: boolean;
  message: string;
  url?: string;
  urlText?: string;
  active?: boolean;
  icon?: string;
}) {
  if (!isToast) return null;
  return (
    <>
      <div
        className={
          ''
        }
      >
        <div className="inline-block">
          <div
            className={`item-center flex min-w-[360px] max-w-fit justify-between rounded-[8px] p-[16px] ${active ? 'bg-[#4998E9]' : 'bg-[#565656]'}`}
          >
            <div className="flex items-center gap-2 text-left text-sm font-semibold text-white">
              {icon && <Image src={icon} alt="icon" width={18} height={18} />}
              {message}
            </div>
            {url && (
              <Link
                href={url}
                className="text-sm font-semibold text-white underline"
              >
                <span>{urlText}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
