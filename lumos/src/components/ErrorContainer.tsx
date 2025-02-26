import React from 'react';
import { CloseIcon, WarningIcon } from '../assets';

interface IErrorContainer {
    message: string;
    onCloseClick?: Function;
}

const ErrorContainer: React.FC<IErrorContainer> = ({ message, onCloseClick }) => {
    return (
        <div className="flex rounded-lg gap-3 bg-errorBg shadow-md p-4">
            <img src={WarningIcon} />
            <div className="text-errorText">{message}</div>
            <img className="cursor-pointer" src={CloseIcon} onClick={() => onCloseClick && onCloseClick()} />
        </div>
    );
};

export default ErrorContainer;
