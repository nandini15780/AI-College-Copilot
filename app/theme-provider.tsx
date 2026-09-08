"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    setDarkMode: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("darkMode");
        if (saved === "true") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const handleSetDarkMode = (val: boolean) => {
        setDarkMode(val);
        localStorage.setItem("darkMode", val.toString());
        if (val) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    // Prevent hydration mismatch flash by not rendering children until mounted
    if (!mounted) {
        return <div className="min-h-screen bg-[#edf3ff]" />;
    }

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode: handleSetDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
