import React from 'react';
import { CloseIcon, WarningIcon } from '../assets';

interface ISuccessContainer {
    message: string;
    onCloseClick?: Function;
}

const SuccessContainer: React.FC<ISuccessContainer> = ({ message, onCloseClick }) => {
    return (
        <div className="flex rounded-lg gap-3 bg-hoverEmerald shadow-md p-4">
            <img src={WarningIcon} />
            <div className="text-emerald">{message}</div>
            <img className="cursor-pointer" src={CloseIcon} onClick={() => onCloseClick && onCloseClick()} />
        </div>
    );
};

export default SuccessContainer;
