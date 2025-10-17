import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import { UserProvider } from '@/context/UserContext';
import { UploadedFilesProvider } from '@/context/UploadedFilesContext';

async function getMessages(locale: string) {
  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    return messages;
  } catch (e) {
    return null;
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  if (!messages) notFound();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProviderWrapper>
        <UserProvider>
          <UploadedFilesProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Toaster position="top-right" reverseOrder={false} />
            </div>
          </UploadedFilesProvider>
        </UserProvider>
      </SessionProviderWrapper>
    </NextIntlClientProvider>
  );
}


