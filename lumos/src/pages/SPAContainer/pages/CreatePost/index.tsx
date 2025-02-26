import Lottie from 'lottie-react';
import React from 'react';
import { CreatePostAnimation } from '../../../../assets';
import useCreatePost from '../../../../hooks/useCreatePost';
import { Button, ErrorContainer, SuccessContainer } from '../../../../components';

const CreatePost: React.FC = () => {
    const {
        content,
        setContent,
        loading,
        createPost,
        selectPlatform,
        selectedPlatforms,
        success,
        setSuccess,
        error,
        setError
    } = useCreatePost();
    const PLATFORM_OPTIONS = [{ label: 'Twitter', value: 'twitter' }];

    return (
        <div className="flex m-8 p-8 border-[1px] rounded-xl w-full justify-between">
            <div className="flex w-[40%]">
                <Lottie animationData={CreatePostAnimation} loop={true} />
            </div>
            <div className="flex flex-col items-center font-bold w-[50%] border-[1px] rounded-xl bg-surface p-8">
                <div className="text-2xl text-primary mb-8">CREATE POST</div>
                <div className="w-full h-full">
                    <div className="text-primary font-medium mb-2">
                        {'Content'} <span className="text-errorText -ml-1">*</span>
                    </div>
                    <textarea
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-emerald focus:ring-[0.8] focus:ring-emerald"
                        rows={6}
                        value={content}
                        placeholder="Enter content here"
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="my-6">
                        <div className="text-primary font-medium my-2">
                            {'Select Platforms'} <span className="text-errorText -ml-1">*</span>
                        </div>
                        {PLATFORM_OPTIONS.map((option) => (
                            <label key={option.value} className="flex items-center space-x-1 cursor-pointer mr-8">
                                <input
                                    type="radio"
                                    name="custom-radio"
                                    value={option.value}
                                    checked={selectedPlatforms.includes(option.value)}
                                    onClick={() => selectPlatform(option.value)}
                                    className="w-4 h-4 accent-emerald bg-gray-100 border-gray-300 focus:ring-emerald"
                                />
                                <span className="font-medium text-primary">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {success && <SuccessContainer message={'Post successfull!'} onCloseClick={() => setSuccess(false)} />}
                {error && <ErrorContainer message={error} onCloseClick={() => setError('')} />}
                <div className="mt-8 w-full self-center items-center">
                    <Button text={'Create'} onClick={createPost} background={'bg-fillGreen'} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
