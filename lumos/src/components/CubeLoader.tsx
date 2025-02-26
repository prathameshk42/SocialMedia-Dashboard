import React from 'react';

const CubeLoader: React.FC = () => {
    return (
        <div className="loader relative w-12 h-12 mx-auto">
            <div className="loader-shadow absolute top-[60px] left-0 w-12 h-[5px] rounded-full bg-hoverEmerald animate-shadow"></div>
            <div className="loader-box absolute inset-0 w-full h-full bg-emerald rounded-[4px] animate-jump"></div>
        </div>
    );
};

export default CubeLoader;
