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
  const [currency, setCurrency] = useState<Currency>("usd");
  const [toman, setToman] = useState("");
  const [foreign, setForeign] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [useManualRate, setUseManualRate] = useState(false);
  const [manualRate, setManualRate] = useState("");
const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/exchange");
        const data = await res.json();
        if (data.rates) {
          setRates({
            usd: Number(data.rates.usd.value),
            eur: Number(data.rates.eur.value),
            aed: Number(data.rates.aed.value),
            try: Number(data.rates.try.value),
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
  useEffect(() => {
  const selectedRate = useManualRate ? Number(manualRate) : rates?.[currency];
  if (!selectedRate || isNaN(selectedRate)) return;

  if (toman && !foreign) {
    const result = Number(toman) / selectedRate;
    setForeign(result.toFixed(2));
  } else if (!toman && foreign) {
    const result = Number(foreign) * selectedRate;
    setToman(result.toFixed(0));
  }
}, [manualRate, currency, rates, useManualRate]);


const convertCurrency = () => {
  setError(""); 

  const selectedRate = useManualRate ? Number(manualRate) : rates?.[currency];

  if (!selectedRate || isNaN(selectedRate) || selectedRate <= 0) {
    setError("نرخ تبدیل نامعتبر است.");
    return;
  }

  const tomanVal = Number(toman);
  const foreignVal = Number(foreign);


  if (toman && isNaN(tomanVal)) {
    setError("مقدار تومان باید عدد باشد.");
    return;
  }
  if (foreign && isNaN(foreignVal)) {
    setError("مقدار ارز خارجی باید عدد باشد.");
    return;
  }

  if (toman && !foreign) {
    const result = tomanVal / selectedRate;
    setForeign(result.toFixed(2));
  } else if (!toman && foreign) {
    const result = foreignVal * selectedRate;
    setToman(result.toFixed(0));
  } else if (toman && foreign) {
    const result = tomanVal / selectedRate;
    setForeign(result.toFixed(2));
  } else {
    setError("لطفاً یکی از فیلدها را پر کنید.");
  }
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-800">مبدل ارز</h1>

        {isLoading && !useManualRate && (
          <div className="text-center text-sm text-gray-600 animate-pulse">
            در حال دریافت نرخ ارز...
          </div>
        )}

        <div className="space-y-2">
          <label className="text-black text-sm font-medium">مقدار به تومان</label>
          <input
            type="text"
            inputMode="numeric"
            value={toman}
            onChange={(e) => {
              setToman(e.target.value);
              setForeign("");
            }}
            className="w-full border border-gray-300 rounded-xl p-2 text-black text-right focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="مقدار به تومان وارد کنید"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-black text-sm font-medium">
              مقدار به {currencyNames[currency]}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="border border-gray-300 rounded p-1 text-black text-sm focus:outline-none"
            >
              {Object.entries(currencyNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={foreign}
            onChange={(e) => {
              setForeign(e.target.value);
              setToman("");
            }}
            className="w-full border border-gray-300 rounded-xl p-2 text-black text-right focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder={`مقدار به ${currencyNames[currency]} وارد کنید`}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="manualRate"
            type="checkbox"
            checked={useManualRate}
            onChange={() => {
              setUseManualRate(!useManualRate);
              setManualRate("");
            }}
          />
          <label htmlFor="manualRate" className="text-sm text-gray-700">
            ورود نرخ به‌صورت دستی
          </label>
        </div>

        {useManualRate && (
          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              نرخ تبدیل دستی برای {currencyNames[currency]} (به تومان)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={manualRate}
              onChange={(e) => setManualRate(e.target.value)}
              className="w-full border border-green-400 rounded-xl p-2 text-black text-right focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder={`مثلاً 55000`}
            />
          </div>
        )}
{error && (
  <div className="text-red-600 text-sm text-center border border-red-300 bg-red-50 p-2 rounded-xl">
    {error}
  </div>
)}

        <button
          onClick={convertCurrency}
          disabled={!useManualRate && isLoading}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
        >
          تبدیل کن ✅
        </button>
      </div>
    </main>
  );
}
