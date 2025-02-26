import React, { useState } from 'react';

interface IRadioButton {
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    selectedValue?: string;
}

const RadioButton: React.FC<IRadioButton> = ({ options, onChange, selectedValue }) => {
    const [selected, setSelected] = useState<string | undefined>(selectedValue);

    const handleSelect = (value: string) => {
        setSelected(value);
        onChange(value);
    };

    return (
        <div className="flex">
            {options.map((option) => (
                <label key={option.value} className="flex items-center space-x-1 cursor-pointer mr-8">
                    <input
                        type="radio"
                        name="custom-radio"
                        value={option.value}
                        checked={selected === option.value}
                        onChange={() => handleSelect(option.value)}
                        className="w-4 h-4 accent-emerald bg-gray-100 border-gray-300 focus:ring-emerald"
                    />
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default RadioButton;
