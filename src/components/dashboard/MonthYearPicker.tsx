
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthYearPickerProps {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  // Get the current year for generating year options
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 5 },
    (_, i) => currentYear - 2 + i
  );

  const months = [
    { value: 0, label: "Januari" },
    { value: 1, label: "Februari" },
    { value: 2, label: "Maret" },
    { value: 3, label: "April" },
    { value: 4, label: "Mei" },
    { value: 5, label: "Juni" },
    { value: 6, label: "Juli" },
    { value: 7, label: "Agustus" },
    { value: 8, label: "September" },
    { value: 9, label: "Oktober" },
    { value: 10, label: "November" },
    { value: 11, label: "Desember" },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedMonth.toString()}
        onValueChange={(value) => setSelectedMonth(parseInt(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Pilih Bulan" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem
              key={month.value}
              value={month.value.toString()}
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => setSelectedYear(parseInt(value))}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Pilih Tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthYearPicker;
