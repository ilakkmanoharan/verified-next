import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Learn. Prove it. Get hired.
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Take focused software engineering assessments, build your profile, and
          let employers find you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-600 px-6 py-3 text-base font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
