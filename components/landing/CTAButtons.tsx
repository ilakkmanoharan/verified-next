import Link from "next/link";

export function CTAButtons() {
  return (
    <section className="border-t border-zinc-800 px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-semibold text-white">
          Ready to level up?
        </h2>
        <p className="mt-2 text-zinc-400">
          Create your profile and start taking assessments today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Sign up free
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
