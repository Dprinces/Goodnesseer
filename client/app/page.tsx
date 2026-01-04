import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black text-center px-4">
      <main className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
          Share Your Thoughts <span className="text-blue-600">Anonymously</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Goodnesseer is a safe, judgment-free space to ask questions, express
          emotions, and find support. Connect with a community that cares,
          without revealing who you are.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/compose"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Start Sharing Anonymously
          </Link>
          <Link
            href="/feed"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Explore Feed <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 text-left">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Safe Expression</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Post without fear of judgment. Your identity is always protected.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive empathy and advice from people who understand.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Moderated Safety</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We ensure a respectful environment with active moderation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
