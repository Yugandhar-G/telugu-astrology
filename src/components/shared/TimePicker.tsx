'use client';

import React from 'react';

interface TimePickerProps {
    value: string; // Format "HH:mm"
    onChange: (value: string) => void;
    className?: string;
}

export function TimePicker({ value, onChange, className = '' }: TimePickerProps) {
    // Parse current value
    const [hours, minutes] = (value || '00:00').split(':').map(Number);

    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHour = e.target.value.padStart(2, '0');
        const currentMinute = String(minutes).padStart(2, '0');
        onChange(`${newHour}:${currentMinute}`);
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currentHour = String(hours).padStart(2, '0');
        const newMinute = e.target.value.padStart(2, '0');
        onChange(`${currentHour}:${newMinute}`);
    };

    // Generate options
    const hourOptions = Array.from({ length: 24 }, (_, i) => i);
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className="relative">
                <select
                    value={hours}
                    onChange={handleHourChange}
                    className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                    {hourOptions.map((h) => (
                        <option key={h} value={h}>
                            {String(h).padStart(2, '0')}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            <span className="text-gray-500 font-bold">:</span>
            <div className="relative">
                <select
                    value={minutes}
                    onChange={handleMinuteChange}
                    className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                    {minuteOptions.map((m) => (
                        <option key={m} value={m}>
                            {String(m).padStart(2, '0')}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
