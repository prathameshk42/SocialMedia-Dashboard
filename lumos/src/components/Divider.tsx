import React from 'react';

interface IDivider {
    text?: string;
}

const Divider: React.FC<IDivider> = ({ text }) => {
    return (
        <div className="flex items-center my-10">
            <div className="flex-grow border-t border-gray-300"></div>
            {text && <span className="px-2 text-gray-500">OR</span>}
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    );
};

export default Divider;
