import React from 'react';
import { Loader } from '.';

interface IButton {
    text: string;
    onClick: (e: React.MouseEvent) => void;
    icon?: string;
    loading?: boolean;
    background?: string;
}

const Button: React.FC<IButton> = ({ text, icon, onClick, loading, background }) => {
    return (
        <div
            className={`flex border-[1px] border-divider border-solid gap-2 px-6 py-4 rounded-xl box-border justify-center cursor-pointer max-h-14
                ${background ? background : ''}`}
            onClick={onClick}
        >
            {loading ? (
                <Loader />
            ) : (
                <>
                    {icon && <img width={20} height={20} src={icon} />}
                    <div className="text-primary text-base">{text}</div>
                </>
            )}
        </div>
    );
};

export default Button;
