'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function CustomDropdown({ options, value, onChange, placeholder = 'Select...' }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center justify-between rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#c8a96e]/40 ${isOpen ? 'bg-[#0a0a0a]' : 'bg-[#111] hover:bg-[#161616]'
                    } text-[#f5f5f5]`}
            >
                <span className={!selectedOption ? 'text-[#888]' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 text-[#888] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/[0.06] bg-[#0a0a0a] py-1 shadow-xl">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${option.value === value
                                    ? 'bg-[#1b65d1] text-white'
                                    : 'text-[#f5f5f5] hover:bg-white/[0.04]'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
