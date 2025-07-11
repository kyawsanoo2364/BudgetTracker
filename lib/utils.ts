import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import currencies from "../currencies_with_locale.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Currencies = currencies;

export const CurrencyFormatterFn = (currency: string) => {
  const currencyLocale =
    currencies.find((c) => c.currency === currency)?.locale || "en-US";

  if (!currency) {
    throw new Error("Currency code is required.");
  }
  return Intl.NumberFormat(currencyLocale, {
    style: "currency",
    currency,
  });
};

export const getMonths = () => {
  return Array.from({ length: 12 }).map((_, i) => {
    const month = new Date(2025, i).toLocaleString("default", {
      month: "long",
    });

    return month;
  });
};
