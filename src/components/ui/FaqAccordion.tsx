"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border transition-colors ${
              isOpen ? "border-[#B6FF5C]/40 bg-[#161616]" : "border-[#262626] bg-[#131313]"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 select-none focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-mono text-xs sm:text-sm font-bold text-[#F5F3EF] uppercase">
                {item.q}
              </span>
              <span className="p-1 bg-[#1C1C1C] border border-[#303030] text-[#B6FF5C] flex-shrink-0">
                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#A5A5A5] leading-relaxed border-t border-[#222] pt-4">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
