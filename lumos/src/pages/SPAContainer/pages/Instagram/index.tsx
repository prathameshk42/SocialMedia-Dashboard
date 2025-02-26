import React from 'react';
import { Button } from '../../../../components';
import useInstagram from '../../../../hooks/useInstagram';
import Lottie from 'lottie-react';
import { InstagramPostAnimation } from '../../../../assets';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../../redux';

const Instagram: React.FC = () => {
    const userDetails = useSelector((state: ReduxState) => state.user);
    const { isAuthenticated, onLogin, loading } = useInstagram();

    return (
        <div className="flex p-20 w-full h-dvh">
            {!isAuthenticated ? (
                <>
                    <div className="w-[60%]">
                        <div className="text-3xl text-primary">Welcome {userDetails.name}!</div>
                        <div className="text-xl text-primary mt-4">Let's get started</div>
                        <div className="flex flex-col mr-28 mt-20 items-center rounded-xl bg-surface p-8 h-80">
                            <div className="text-primary text-lg py-6 text-center">
                                Access Your Account: Log in with Instagram to Post and Personalize Your Profile
                            </div>
                            <Button
                                text={'Instagram Login'}
                                onClick={onLogin}
                                loading={loading}
                                background={'bg-fillGreen'}
                            />
                        </div>
                    </div>
                    <div className="flex w-[40%]">
                        <Lottie animationData={InstagramPostAnimation} loop={true} />
                    </div>
                </>
            ) : (
                <div>AUTHENTICATED</div>
            )}
        </div>
    );
};

export default Instagram;
