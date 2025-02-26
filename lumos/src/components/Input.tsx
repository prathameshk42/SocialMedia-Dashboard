import React, { HTMLInputTypeAttribute } from 'react';

interface IInput {
    type?: HTMLInputTypeAttribute;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    title?: string;
    mandatory?: boolean;
}

const Input: React.FC<IInput> = ({ onChange, title, type = 'text', mandatory = false }) => {
    return (
        <div className="mb-4">
            {title && (
                <div className="text-primary font-medium mb-1">
                    {title} {mandatory && <span className="text-errorText -ml-1">*</span>}
                </div>
            )}
            <input
                type={type}
                placeholder={`Enter ${title || ''}`}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-emerald focus:ring-[0.8] focus:ring-emerald"
                onChange={onChange}
            />
        </div>
    );
};

export default Input;
