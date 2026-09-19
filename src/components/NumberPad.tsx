import React from 'react';

interface NumberPadProps {
  numberCounts?: Record<number, number>;
  selectedNumber?: number | null;
  onNumberClick?: (num: number) => void;
  disabled?: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  numberCounts = {
    1: 2,
    2: 3,
    3: 4,
    4: 2,
    5: 1,
    6: 3,
    7: 2,
    8: 2,
    9: 1,
  },
  selectedNumber = 5,
  onNumberClick,
  disabled = false,
}) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-[360px] mx-auto grid grid-cols-9 gap-1 select-none">
      {digits.map((num) => {
        const count = numberCounts[num] ?? 0;
        const isDepleted = count <= 0;
        const isSelected = selectedNumber === num;

        return (
          <button
            key={num}
            id={`numpad-btn-${num}`}
            type="button"
            disabled={disabled || isDepleted}
            onClick={() => onNumberClick?.(num)}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#212C1B] dark:bg-[#273322] text-white dark:text-[#F1F3E8] border-[#212C1B] dark:border-[#AEBB7A] shadow-sm'
                : isDepleted
                ? 'bg-[#F2F5ED] dark:bg-[#151B12] border-[#E0E8D7] dark:border-[#2A3424] text-[#9EA995] dark:text-[#465438] opacity-40 cursor-not-allowed'
                : 'bg-white dark:bg-[#192016] border-[#D5DEC9] dark:border-[#35412B] text-[#242F1E] dark:text-[#F1F3E8] hover:bg-[#EFF4EA] dark:hover:bg-[#20291B] active:scale-95'
            }`}
            aria-label={`Digit ${num}, ${count} remaining`}
          >
            <span
              className={`text-lg sm:text-xl font-bold leading-tight ${
                isSelected ? 'text-white dark:text-[#F1F3E8]' : 'text-[#212C1B] dark:text-[#F1F3E8]'
              }`}
            >
              {num}
            </span>
            <span
              className={`text-[8px] font-medium leading-none mt-0.5 whitespace-nowrap ${
                isSelected ? 'text-[#C9D6BE] dark:text-[#AEBB7A]' : 'text-[#6C7C60] dark:text-[#8F997F]'
              }`}
            >
              {count} left
            </span>
          </button>
        );
      })}
    </div>
  );
};
