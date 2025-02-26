import React from 'react';
import Lottie from 'lottie-react';
import { GoogleIcon, LoginAnimation } from '../../assets';
import { Button, Divider, ErrorContainer, Input, RadioButton, SuccessContainer } from '../../components';
import useLogin from '../../hooks/useLogin';
import { GENDER_OPTIONS } from '../../utils/constants';

const Login = () => {
    const {
        signInWithGoogle,
        error,
        clearError,
        loading,
        signUp,
        onCreateAccount,
        accountExists,
        setName,
        setAge,
        setGender,
        gender,
        onSignup,
        setEmail,
        registration,
        setRegistration
    } = useLogin();

    return (
        <div className="flex w-dvw h-dvh bg-emerald">
            <div className="flex flex-col w-[58%] justify-center items-center">
                <div className="flex w-[58%] mb-8">
                    <Lottie animationData={LoginAnimation} loop={true} />
                </div>
                <div className="text-fillGreen text-4xl my-8">Social Media Meets Simplicity</div>
                <div className="text-white text-xl">One Login, Endless Connections.</div>
            </div>
            <div className="flex flex-col w-[35%] min-h-[80%] bg-white self-center rounded-3xl px-12 py-12 box-border">
                {!signUp ? (
                    <>
                        <div className="text-fillGrey font-semibold text-3xl mb-2 mt-4">Get Started</div>
                        <div className="text-primary mb-14">Login to get all your profiles under one roof.</div>
                        {registration && (
                            <div className="mb-6">
                                <SuccessContainer
                                    message={'Signup Successfull! Please login to continue.'}
                                    onCloseClick={() => setRegistration(false)}
                                />
                            </div>
                        )}
                        <Button
                            text={'Continue with Google'}
                            icon={GoogleIcon}
                            onClick={signInWithGoogle}
                            loading={loading}
                        />
                        {error && (
                            <div className="flex self-center mt-6 w-[90%]">
                                <ErrorContainer message={error} onCloseClick={clearError} />
                            </div>
                        )}
                        <Divider text="OR" />
                        <Button text={'Create a new Account'} onClick={onCreateAccount} background={'bg-fillGreen'} />
                    </>
                ) : (
                    <>
                        <div className="flex justify-center text-fillGrey font-semibold text-3xl mb-2">
                            Create a new Account
                        </div>
                        <div className="flex justify-center text-primary mb-4">Its quick and easy.</div>

                        <Input onChange={(e) => setName(e.target.value)} title={'Name'} mandatory={true} />
                        <Input onChange={(e) => setEmail(e.target.value)} title={'Email'} mandatory={true} />
                        <Input type="number" onChange={(e) => setAge(e.target.value)} title={'Age'} mandatory={true} />

                        <div className="flex">
                            <div className="text-primary font-medium mb-2">Gender</div>
                            <span className="text-errorText ml-[2px]">*</span>
                        </div>
                        <RadioButton options={GENDER_OPTIONS} onChange={setGender} selectedValue={gender} />

                        {error && (
                            <div className="flex self-center mt-4 w-[90%]">
                                <ErrorContainer message={error} onCloseClick={clearError} />
                            </div>
                        )}

                        <div className="mt-6">
                            <Button text={'Signup'} onClick={onSignup} background={'bg-fillGreen'} loading={loading} />
                            <div
                                className="flex justify-center mt-4 text-emerald underline cursor-pointer"
                                onClick={accountExists}
                            >
                                Already have an Account?
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
