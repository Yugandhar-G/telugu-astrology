'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, setMonth, setYear } from 'date-fns';

interface DatePickerProps {
    selected: Date;
    onChange: (date: Date) => void;
    className?: string;
}

export function DatePicker({ selected, onChange, className = '' }: DatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    // Sync internal month with selected date if it changes externally
    useEffect(() => {
        if (selected) {
            setCurrentMonth(selected);
        }
    }, [selected]);

    const onDateClick = (day: Date) => {
        // Create a new date at 12:00 PM local time to avoid timezone edge cases (off-by-one)
        // We preserve the time if it's relevant, but for a pure date picker noon is safest
        const newDate = new Date(day);
        newDate.setHours(12, 0, 0, 0);
        onChange(newDate);
        setIsOpen(false);
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const renderHeader = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let i = 1900; i <= currentYear + 10; i++) {
            years.push(i);
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newYear = parseInt(e.target.value);
            setCurrentMonth(prev => setYear(prev, newYear));
        };

        const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newMonthIndex = parseInt(e.target.value);
            setCurrentMonth(prev => setMonth(prev, newMonthIndex));
        };

        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none"
                    type="button"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex items-center space-x-2">
                    <select
                        value={currentMonth.getMonth()}
                        onChange={handleMonthChange}
                        className="bg-transparent font-semibold text-gray-800 cursor-pointer focus:outline-none text-sm"
                    >
                        {months.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={currentMonth.getFullYear()}
                        onChange={handleYearChange}
                        className="bg-transparent font-semibold text-gray-800 cursor-pointer focus:outline-none text-sm"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none"
                    type="button"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = 'EEE';
        const days = [];
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2 border-b border-gray-100 pb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day; // Capture closure value

                // Compare specific parts to avoid time issues
                const isSelected = isSameDay(day, selected);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isCurrentDay = isToday(day);

                days.push(
                    <div
                        className={`
                            h-8 w-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors
                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                            ${isSelected ? 'bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-sm' : 'hover:bg-primary-50'}
                            ${isCurrentDay && !isSelected ? 'ring-2 ring-primary-600 text-primary-600 font-bold' : ''}
                        `}
                        key={day.toISOString()} // Stable key
                        onClick={() => onDateClick(cloneDay)}
                    >
                        {formattedDate}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1 place-items-center mb-1" key={day.toISOString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <div className={`relative ${className}`}>
            <div
                className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-900 font-medium">{format(selected, 'dd MMMM yyyy')}</span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
}
