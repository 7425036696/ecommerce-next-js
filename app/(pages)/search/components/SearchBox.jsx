"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState(""); // always a string
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const router = useRouter();

  useEffect(() => {
    setQuery(q || ""); // Fix: if q is null, fallback to ""
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?q=${query}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full justify-center gap-3 items-center"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter Product Name ..."
        type="text"
        className="border px-5 py-2 rounded-xl bg-white focus:outline-none"
        required
      />
      <button type="submit" className="flex items-center gap-1">
        <Search size={13} />
        <span>Search</span>
      </button>
    </form>
  );
}
