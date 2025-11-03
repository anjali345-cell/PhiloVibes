"use client";

interface FilterBarProps {
  topics: string[];
  active: string;
  onSelect: (topic: string) => void;
}

export default function FilterBar({ topics, active, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className={`px-4 py-2 rounded-full text-sm transition ${
            active === topic
              ? "bg-[#A67C52] text-white shadow-sm"
              : "bg-[#F9F5EC] border border-gray-300 hover:bg-[#F3ECE0]"
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
