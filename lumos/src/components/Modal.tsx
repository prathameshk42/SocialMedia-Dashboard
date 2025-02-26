import React, { useEffect } from 'react';

interface IModal {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    title?: string;
    hideHeaderBorder?: boolean;
    children?: React.ReactNode;
    disablePadding?: boolean;
    isModalClosable?: boolean;
    overflow?: 'visible' | 'hidden' | 'auto';
    closeOnBlur?: boolean;
}

const Modal: React.FC<IModal> = ({
    isVisible,
    setIsVisible,
    title = '',
    hideHeaderBorder = false,
    children,
    disablePadding = false,
    isModalClosable = true,
    overflow = 'auto',
    closeOnBlur = true
}) => {
    const handleModalClose = () => {
        if (!isModalClosable) return;
        setIsVisible(false);
    };

    const handleOnBlur: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!closeOnBlur || e.target !== e.currentTarget) return;
        setIsVisible(false);
    };

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={handleOnBlur}
        >
            <div
                className={`bg-white rounded-lg shadow-lg w-full max-w-lg max-h-full overflow-${overflow} ${
                    !disablePadding ? 'p-6' : ''
                } relative`}
            >
                {/* Header */}
                {title && (
                    <div
                        className={`flex justify-between items-center ${
                            !hideHeaderBorder ? 'border-b border-gray-200' : ''
                        } pb-4`}
                    >
                        <h2 className="text-xl font-semibold text-primary">{title}</h2>
                        {isModalClosable && (
                            <button
                                onClick={handleModalClose}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                ✖
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={`flex-1 overflow-${overflow}`}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
