import Image from "next/image";
import { notFound } from "next/navigation";

async function getBookDetails(id: string) {
  const res = await fetch(`https://openlibrary.org/works/${id}.json`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookData = await getBookDetails(id);

  if (!bookData) return notFound();

  const cover = bookData.covers?.length
    ? `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`
    : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {cover ? (
            <Image
              src={cover}
              alt={bookData.title}
              className="w-full md:w-1/3 rounded-xl shadow-md"
              width={300}
              height={400}
            />
          ) : (
            <div className="w-full md:w-1/3 h-80 bg-amber-100 flex items-center justify-center text-amber-700 font-medium rounded-xl shadow-md">
              No Cover
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-serif text-amber-900 mb-2">
              {bookData.title}
            </h1>
            {bookData.description && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {typeof bookData.description === "string"
                  ? bookData.description
                  : bookData.description.value}
              </p>
            )}
            {bookData.first_publish_date && (
              <p className="text-sm text-gray-500 mb-2">
                First published: {bookData.first_publish_date}
              </p>
            )}
            {bookData.subjects && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Subjects:</strong> {bookData.subjects.slice(0, 6).join(", ")}
              </p>
            )}
            <a
              href={`https://openlibrary.org/works/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
            >
              View on Open Library →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
