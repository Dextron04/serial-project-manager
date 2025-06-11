import { useState } from 'react';
import { Globe } from 'lucide-react';
import i18n from '../i18n';

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en-US', label: 'English (US)' },
        { code: 'en-GB', label: 'English (UK)' },
        { code: 'es-MX', label: 'Español (México)' },
        { code: 'es-ES', label: 'Español (España)' }
    ];

    const currentLang = i18n.language || 'en-US';

    const changeLang = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <footer className="bg-gray-900/80 py-12 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-4">
                    <div>
                        <div className="mb-4 flex items-center">
                            <div className="h-8 w-8 rounded-md bg-blue-500"></div>
                            <span className="ml-2 text-xl font-bold">Serial PM</span>
                        </div>
                        <p className="mb-4 text-gray-400">
                            Project management reimagined for modern teams.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons */}
                            <a href="#" className="text-gray-400 hover:text-blue-400">
                                <div className="h-6 w-6 rounded-full bg-gray-700"></div>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400">
                                <div className="h-6 w-6 rounded-full bg-gray-700"></div>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400">
                                <div className="h-6 w-6 rounded-full bg-gray-700"></div>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-bold">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400">Use Cases</a></li>
                            <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-400">Integrations</a></li>
                            <li><a href="#" className="hover:text-blue-400">Roadmap</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-bold">Resources</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-400">API Reference</a></li>
                            <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400">Tutorials</a></li>
                            <li><a href="#" className="hover:text-blue-400">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-bold">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                            <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} Serial PM. All rights reserved.</p>

                    {/* Improved Language Switcher */}
                    <div className="mt-4 md:mt-0 relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center space-x-2 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition duration-200"
                            aria-expanded={isOpen}
                            aria-haspopup="listbox"
                            aria-label="Select language"
                        >
                            <Globe size={16} />
                            <span>{languages.find(lang => lang.code === currentLang)?.label || 'English (US)'}</span>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <ul
                                    className="py-1"
                                    role="listbox"
                                    aria-activedescendant={currentLang}
                                >
                                    {languages.map((lang) => (
                                        <li
                                            key={lang.code}
                                            id={lang.code}
                                            role="option"
                                            aria-selected={currentLang === lang.code}
                                            className={`px-4 py-2 text-sm cursor-pointer ${currentLang === lang.code
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700'
                                                }`}
                                            onClick={() => changeLang(lang.code)}
                                        >
                                            {lang.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}