export function FeatureCards() {
  const features = [
    {
      title: "Focused assessments",
      description:
        "5-question tests in system design, algorithms, and more. One concept at a time.",
    },
    {
      title: "Learn from every answer",
      description:
        "Review correct answers with explanations and links to in-app content.",
    },
    {
      title: "Profile that gets you hired",
      description:
        "Showcase projects, certifications, and test scores. Employers discover you.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          Built for engineers
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <h3 className="font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
