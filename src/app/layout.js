import { IBM_Plex_Mono } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700']
});

export const metadata = {
  title: 'QuizLing',
  description: 'Language Learning'
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${ibmPlexMono.className} antialiased`}>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
