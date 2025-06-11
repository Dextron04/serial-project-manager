import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";

const DatabaseSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;
    // Debounced search function
    const debouncedSearch = useRef(
        debounce(async (query) => {
            if (query.trim().length > 2) {
                setIsLoading(true);
                try {
                    console.log("Making search request for:", query);
                    const response = await fetch(
                        `${API_URL}/api/projects/search?q=${encodeURIComponent(query)}`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const results = await response.json();
                    console.log("Search results received:", results);
                    setSearchResults(results);
                    setIsSearching(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setSearchResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsSearching(false);
                setSearchResults([]);
            }
        }, 300)
    ).current;

    // Handle search query changes
    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    // Handle clicking outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearching(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle result click
    const handleResultClick = (result) => {
        console.log("Result clicked:", result);
        setIsSearching(false);
        setSearchQuery("");
        // Navigate to the project page with the project data
        navigate(`/project/${result.project_id}`, {
            state: {
                project: result,
                fromSearch: true,
            },
        });
    };

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative">
                <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transform transition-colors duration-300 ${isFocused ? "text-blue-400" : "text-gray-400"
                        }`}
                />

                <input
                    type="text"
                    placeholder="Search projects, tasks, or users..."
                    className={`w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2 pl-12 pr-10 text-white transition-all duration-300 placeholder:text-gray-400 focus:outline-none ${isFocused ? "border-blue-500" : "hover:border-gray-600"
                        }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                        setIsFocused(true);
                        if (searchQuery.trim().length > 2) setIsSearching(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                />

                {searchQuery && (
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-200"
                        onClick={() => {
                            setSearchQuery("");
                            setIsSearching(false);
                        }}
                        aria-label="Clear search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {isSearching && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800/90 shadow-lg backdrop-blur-md">
                    {isLoading ? (
                        <div className="p-4 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-400"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <div
                                key={result.project_id}
                                className="cursor-pointer border-b border-gray-700 p-4 transition-colors hover:bg-gray-700/50"
                                onClick={() => handleResultClick(result)}
                            >
                                <h3 className="mb-1 font-medium text-blue-300">
                                    {result.title}
                                </h3>
                                <p className="text-sm text-gray-300">{result.description}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                                    <span>Status: {result.status}</span>
                                    <span>•</span>
                                    <span>Owner: {result.owner_name}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-gray-300">
                                No results found for "{searchQuery}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DatabaseSearch;
