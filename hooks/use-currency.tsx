'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (priceUSD: number) => string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const FALLBACK_RATES: Record<Currency, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    JPY: 1.81,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
};

const CACHE_KEY = 'satya_vij_rates_v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('INR');
    const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initCurrency() {
            try {
                let currentRates = FALLBACK_RATES;
                const cached = localStorage.getItem(CACHE_KEY);

                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
                        currentRates = parsed.rates;
                        setRates(parsed.rates);
                    }
                }

                if (currentRates === FALLBACK_RATES) {
                    const res = await fetch('https://open.er-api.com/v6/latest/INR');
                    const data = await res.json();
                    if (data?.rates) {
                        const newRates = {
                            INR: 1,
                            USD: data.rates.USD || FALLBACK_RATES.USD,
                            EUR: data.rates.EUR || FALLBACK_RATES.EUR,
                            GBP: data.rates.GBP || FALLBACK_RATES.GBP,
                            JPY: data.rates.JPY || FALLBACK_RATES.JPY,
                        };
                        setRates(newRates);
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            rates: newRates,
                            timestamp: Date.now()
                        }));
                        currentRates = newRates;
                    }
                }

                const ipRes = await fetch('https://ipapi.co/json/');
                const ipData = await ipRes.json();
                if (ipData.currency && currentRates[ipData.currency as Currency]) {
                    setCurrency(ipData.currency as Currency);
                }
            } catch (err) {
                console.error('Currency init failed:', err);
            } finally {
                setIsLoading(false);
            }
        }
        initCurrency();
    }, []);

    const formatPrice = (priceINR: number) => {
        const rate = rates[currency] || FALLBACK_RATES[currency];
        const converted = priceINR * rate;
        const symbol = CURRENCY_SYMBOLS[currency];
        return `${symbol}${converted.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
