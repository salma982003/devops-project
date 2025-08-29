"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SectorFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (sector: string) => {
    const params = new URLSearchParams();
    params.set('filter', sector);
    router.push(`/posts?${params.toString()}`);
  };

  const clearFilter = () => {
    router.push('/posts');
  };

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Filter by Sector</h3>
      <ul className="space-y-1">
        <li>
          <button 
            onClick={() => handleFilter("AgriTech")}
            className="hover:text-blue-600 hover:underline"
          >
            AgriTech
          </button>
          <ul className="ml-4 mt-1 space-y-1">
            {["FoodTech", "Sustainability", "Policy", "Logistics", "Markets"].map((sector) => (
              <li key={sector}>
                <button
                  onClick={() => handleFilter(sector)}
                  className="hover:text-blue-400 text-sm"
                >
                  {sector}
                </button>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      {searchParams.get('filter') && (
        <button 
          onClick={clearFilter}
          className="text-sm text-blue-500 hover:underline mt-2"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}