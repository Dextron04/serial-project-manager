import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const EnhancedSearchBar = ({ contentSections }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);

    // Search logic for landing page content
    useEffect(() => {
        if (searchQuery.trim().length > 2) {
            const query = searchQuery.toLowerCase();
            const results = contentSections.filter(
                (section) =>
                    section.title.toLowerCase().includes(query) ||
                    section.content.toLowerCase().includes(query)
            ).map((section) => ({
                id: section.id,
                title: section.title,
                content: section.content,
                highlight: `...${section.content.substring(0, 50)}...`
            }));
            setSearchResults(results);
            setIsSearching(true);
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    }, [searchQuery, contentSections]);

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

    // Scroll to section function
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            element.classList.add("highlight-section");
            setTimeout(() => element.classList.remove("highlight-section"), 2000);
        }
        setIsSearching(false);
        setSearchQuery("");
    };

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-blue-400' : 'text-gray-400'}`} />

                <input
                    type="text"
                    placeholder="Search features, benefits, pricing..."
                    className={`pl-12 pr-10 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 w-full transition-all duration-300 focus:outline-none ${isFocused ? 'border-blue-500' : 'hover:border-gray-600'}`}
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
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <div
                                key={result.id}
                                className="p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                                onClick={() => scrollToSection(result.id)}
                            >
                                <h3 className="font-medium text-blue-300 mb-1">{result.title}</h3>
                                <p className="text-sm text-gray-300">{result.highlight}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-gray-300 mb-3">No results found for "{searchQuery}"</p>
                            {contentSections.map((section) => (
                                <div
                                    key={section.id}
                                    className="p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                                    onClick={() => scrollToSection(section.id)}
                                >
                                    <h3 className="font-medium text-blue-300 mb-1">{section.title}</h3>
                                    <p className="text-sm text-gray-300">{section.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedSearchBar;