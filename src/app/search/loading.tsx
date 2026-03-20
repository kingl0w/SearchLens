export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-[54px] animate-pulse rounded-xl bg-gray-200" />

      <div className="flex gap-8">
        <div className="hidden w-[280px] shrink-0 lg:block">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-8 w-full rounded bg-gray-100" />
                <div className="h-8 w-full rounded bg-gray-100" />
                <div className="h-8 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 border-l-[3px] border-l-gray-300 bg-white p-5"
            >
              <div className="mb-3 flex gap-2">
                <div className="h-5 w-24 rounded-full bg-gray-200" />
                <div className="h-5 w-16 rounded bg-gray-100" />
              </div>
              <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mb-2 flex gap-3">
                <div className="h-4 w-20 rounded bg-gray-100" />
                <div className="h-4 w-12 rounded bg-gray-100" />
              </div>
              <div className="mb-1 h-4 w-full rounded bg-gray-100" />
              <div className="mb-3 h-4 w-2/3 rounded bg-gray-100" />
              <div className="flex gap-3">
                <div className="h-3.5 w-20 rounded bg-gray-100" />
                <div className="h-3.5 w-20 rounded bg-gray-100" />
                <div className="h-3.5 w-32 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
