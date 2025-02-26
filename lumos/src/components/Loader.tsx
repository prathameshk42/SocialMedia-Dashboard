import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="loader relative w-[1.5em] h-[1.5em] transform rotate-[165deg]">
            <div className="loader-before absolute top-1/2 left-1/2 block w-[0.5em] h-[0.5em] rounded-[0.25em] translate-x-[-50%] translate-y-[-50%] animate-before"></div>
            <div className="loader-after absolute top-1/2 left-1/2 block w-[0.5em] h-[0.5em] rounded-[0.25em] translate-x-[-50%] translate-y-[-50%] animate-after"></div>
        </div>
    );
};

export default Loader;
