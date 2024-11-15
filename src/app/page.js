import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div
        data-testid="landing page"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
        style={{
          background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
        }}
      >
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Welcome to QuizLing!</h1>
            <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
              <p className="text-sm text-center mb-2">
                Learn new languages or enhance your proficiency in those you
                already know.
              </p>
              <p className="text-sm text-center mb-2">
                Explore our features, including flashcards, AI conversations,
                and of course, quizzes!
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 w-full">
            <Link href="main-menu">
              <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#262626] dark:hover:bg-[#262626] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
                Start Learning
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
