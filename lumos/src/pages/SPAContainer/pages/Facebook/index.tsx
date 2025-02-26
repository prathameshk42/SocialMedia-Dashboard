import React from 'react';
import { Button, CubeLoader } from '../../../../components';
import useFacebook from '../../../../hooks/useFacebook';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../../redux';
import Lottie from 'lottie-react';
import { BirthdayCake, CommentIcon, DeleteIcon, FacebookAnimation, LikeIcon, RetweetIcon } from '../../../../assets';

const Facebook: React.FC = () => {
    const userDetails = useSelector((state: ReduxState) => state.user);
    const { onLogin, isAuthenticated, loading, screenLoader, profile, formatDate } = useFacebook();

    if (screenLoader) {
        return (
            <div className="flex flex-col h-full w-full mt-20 items-center">
                <CubeLoader />
            </div>
        );
    }

    return (
        <div className="flex p-20 w-full h-dvh">
            {!isAuthenticated ? (
                <>
                    <div className="w-[60%]">
                        <div className="text-3xl text-primary">Welcome {userDetails.name}!</div>
                        <div className="text-xl text-primary mt-4">Let's get started</div>
                        <div className="flex flex-col mr-28 mt-20 items-center rounded-xl bg-surface p-8 h-80">
                            <div className="text-primary text-lg py-6 text-center">
                                Access Your Account: Log in with Facebook to Post and Personalize Your Profile
                            </div>
                            <Button
                                text={'Facebook Login'}
                                onClick={onLogin}
                                loading={loading}
                                background={'bg-fillGreen'}
                            />
                        </div>
                    </div>
                    <div className="flex w-[40%]">
                        <Lottie animationData={FacebookAnimation} loop={true} />
                    </div>
                </>
            ) : (
                <div className="flex w-full gap-16">
                    <div className="flex flex-col w-[60%] rounded-xl border-[1px] p-8 bg-surface overflow-y-auto box-border">
                        <div className="my-4 text-primary text-xl">Posts</div>
                        {!profile.posts?.length && (
                            <div className="my-4 text-primary text-xl">No Tweets yet! Please post one.</div>
                        )}
                        {profile.posts?.map((post, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col rounded-xl border-[1px] p-4 w-full h-fit bg-white text-primary mb-6"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <div className="flex bg-yellow w-12 h-12 justify-center items-center text-lg font-bold rounded-full uppercase">
                                                <img
                                                    src={profile.picture}
                                                    className="object-contain w-full h-full rounded-full"
                                                />
                                            </div>
                                            <div className="flex flex-col ml-4">
                                                <div className="text-lg">{profile.name}</div>
                                                <div className="text-sm">{formatDate(post.created_time)}</div>
                                            </div>
                                        </div>
                                        <img
                                            width={30}
                                            src={DeleteIcon}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                console.log('DELETE');
                                            }}
                                        />
                                    </div>
                                    <div className="my-4">{post.message || ''}</div>
                                    {post.attachments && (
                                        <div className='p-4'>
                                            <img src={post.attachments} />
                                        </div>
                                    )}
                                    <div className="h-[1px] bg-divider" />
                                    <div className="flex gap-14 mt-3">
                                        <div className="flex gap-2">
                                            <img width={20} src={LikeIcon} />
                                            <div className="">{post.reactions}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <img width={25} src={CommentIcon} />
                                            <div className="">{post.comments}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <img width={25} src={RetweetIcon} />
                                            <div className="">{post.shares}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-col w-[40%] rounded-xl border-[1px] p-8 bg-surface overflow-y-auto box-border">
                        <div className="flex bg-yellow w-28 h-28 justify-center items-center text-lg font-bold rounded-full uppercase">
                            <img src={profile.picture} className="object-contain w-full h-full rounded-full" />
                        </div>
                        <div className="flex flex-col ml-4 text-primary mt-4 mb-10">
                            <div className="text-2xl mb-2">{profile.name}</div>
                            <div className="flex gap-2 items-center mb-4">
                                <img width={30} src={BirthdayCake} />
                                <div className="text-lg">{profile.birthday}</div>
                            </div>
                            <div className="h-[1px] bg-divider" />
                            <div className="flex flex-col mt-4 gap-6">
                                <div className="flex gap-8 items-center w-[70%] justify-between">
                                    <div className="text-xl text-primary">Friends</div>
                                    <div className="text-xl font-bold text-black">{profile?.friends}</div>
                                </div>
                                <div className="flex gap-8 items-center w-[70%] justify-between">
                                    <div className="text-xl text-primary">Posts</div>
                                    <div className="text-xl font-bold text-black">{profile.posts.length}</div>
                                </div>
                                <div className="flex gap-8 items-center w-[70%] justify-between">
                                    <div className="text-xl text-primary">Total Reactions</div>
                                    <div className="text-xl font-bold text-black">
                                        {profile.posts.reduce(function (acc, obj) {
                                            return acc + obj.reactions;
                                        }, 0)}
                                    </div>
                                </div>
                                <div className="flex gap-8 items-center w-[70%] justify-between">
                                    <div className="text-xl text-primary">Total Comments</div>
                                    <div className="text-xl font-bold text-black">
                                        {profile.posts.reduce(function (acc, obj) {
                                            return acc + obj.comments;
                                        }, 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Facebook;
