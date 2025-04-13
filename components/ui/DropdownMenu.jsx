// components/ui/DropdownMenu.jsx
import { useState, useRef, useEffect } from 'react';

export default function DropdownMenu({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          const nextButton = event.target.nextElementSibling;
          if (nextButton) nextButton.focus();
          break;
        case 'ArrowUp':
          event.preventDefault();
          const prevButton = event.target.previousElementSibling;
          if (prevButton) prevButton.focus();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      
      <div 
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 transform transition-all duration-150 ease-in-out ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                option.danger
                  ? 'text-red-600 hover:bg-red-50 focus:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
              }`}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}