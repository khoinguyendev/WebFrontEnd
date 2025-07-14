import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import { formatCurrency, urlList } from "../../../util/Format";
import { IProduct } from "../../../types/Product";
import { useNavigate } from "react-router-dom";

// Highlight search term in result
const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<strong class='text-primary'>$1</strong>");
};

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");
    const [results, setResults] = useState<IProduct[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Debounce keyword input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(keyword.trim());
        }, 500);

        return () => clearTimeout(handler);
    }, [keyword]);

    // Fetch search results
    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedValue) {
                setResults([]);
                return;
            }

            try {
                const res = await axios.get(
                    `${SERVER_HOST}/products/search?query=${debouncedValue}`
                );
                setResults(res.data.data.content || []);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            }
        };

        fetchResults();
    }, [debouncedValue]);

    // Show/hide dropdown based on results and debounced input
    useEffect(() => {
        if (results.length > 0 && debouncedValue) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [results, debouncedValue]);

    // Hide dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDetail = (id: number) => {
        setShowDropdown(false);
        navigate(`/san-pham/${id}`);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => keyword && results.length > 0 && setShowDropdown(true)}
                className="w-full px-4 py-2 border border-primary rounded-md text-ms outline-none text-gray-700"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="cursor-pointer box-content p-2 size-7 absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
            </svg>

            {showDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-200 mt-2 w-full rounded-md shadow-md max-h-[500px] overflow-auto">
                    {results.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => handleDetail(item.id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                            <div className="flex gap-2">
                                <img
                                    src={urlList(item.image)}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover"
                                />
                                <div>
                                    <p
                                        className="line-clamp-2 mb-3"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightMatch(item.name, debouncedValue),
                                        }}
                                    />
                                    <div className="flex gap-3">
                                        <p className="text-price font-bold">
                                            {item.variants[0].sale
                                                ? formatCurrency(item.variants[0].priceSale)
                                                : formatCurrency(item.variants[0].price)}
                                        </p>
                                        {item.variants[0].sale && (
                                            <p className="text-[#98a2b3] text-[14px] line-through">
                                                {formatCurrency(item.variants[0].price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
