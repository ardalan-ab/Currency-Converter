// app/page.tsx
"use client";

import { useEffect, useState } from "react";

type Currency = "usd" | "eur" | "aed" | "try";

const currencyNames: Record<Currency, string> = {
  usd: "دلار",
  eur: "یورو",
  aed: "درهم امارات",
  try: "لیر ترکیه",
};

export default function HomePage() {
  const [rates, setRates] = useState<Record<Currency, number> | null>(null);
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState<Currency>("usd");
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/exchange");
        const data = await res.json();
        if (data.rates) {
          setRates({
            usd: parseFloat(data.rates.usd.value),
            eur: parseFloat(data.rates.eur.value),
            aed: parseFloat(data.rates.aed.value),
            try: parseFloat(data.rates.try.value),
          });
        }
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convert = () => {
    if (!rates) return;

    const fromRate = rates[from];
    const toRate = 1;

    const converted = (amount * fromRate) / toRate;
    setResult(converted);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full space-y-4">
        <h1 className="text-xl text-black font-bold text-center">مبدل ارز</h1>
        {isLoading && (
          <div className="text-center text-sm text-gray-600 animate-pulse">
            در حال دریافت نرخ ارز...
          </div>
        )}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded p-2 text-black "
          placeholder="مقدار"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as Currency)}
          className="w-full border rounded p-2 text-black "
        >
          {Object.entries(currencyNames).map(([key, name]) => (
            <option className="text-black " key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={convert}
          disabled={isLoading}
          className="w-full text-black  bg-green-600 rounded p-2 hover:bg-green-700 transition"
        >
          تبدیل کن
        </button>
        {result !== null && (
          <div className="text-center text-black  mt-4">
            <p>
              مقدار نهایی به تومان:{" "}
              <span className="font-bold">{result.toLocaleString()} تومان</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
