import React, { useState } from 'react';
import { Button, CubeLoader, Modal } from '../../../../components';
import useTwitter from '../../../../hooks/useTwitter';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../../redux';
import Lottie from 'lottie-react';
import {
    BookmarkIcon,
    CommentIcon,
    DeleteIcon,
    GetStartedAnimation,
    LikeIcon,
    RetweetIcon,
    ViewIcon
} from '../../../../assets';

const Twitter: React.FC = () => {
    const userDetails = useSelector((state: ReduxState) => state.user);
    const tweets = useSelector((state: ReduxState) => state.tweet.tweets);
    const profile = useSelector((state: ReduxState) => state.tweet.profile);
    const {
        onTwitterClick,
        loading,
        screenLoader,
        isAuthenticated,
        formatDate,
        deletePost,
        setTweetToDelete,
        confirmDelete,
        setConfirmDelete
    } = useTwitter();

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
                                Access Your Account: Log in with Twitter to Post and Personalize Your Profile
                            </div>
                            <Button
                                text={'Twitter Login'}
                                onClick={onTwitterClick}
                                loading={loading}
                                background={'bg-fillGreen'}
                            />
                        </div>
                    </div>
                    <div className="flex w-[40%]">
                        <Lottie animationData={GetStartedAnimation} loop={true} />
                    </div>
                </>
            ) : (
                <div className="flex w-full gap-16">
                    <div className="flex flex-col w-[60%] rounded-xl border-[1px] p-8 bg-surface overflow-y-auto box-border">
                        <div className="my-4 text-primary text-xl">Posts</div>
                        {!tweets?.length && (
                            <div className="my-4 text-primary text-xl">No Tweets yet! Please post one.</div>
                        )}
                        {tweets?.map((tweet, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col rounded-xl border-[1px] p-4 w-full h-fit bg-white text-primary mb-6"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <div className="flex bg-yellow w-12 h-12 justify-center items-center text-lg font-bold px-2 py-1 rounded-full uppercase">
                                                {userDetails.twitterName.charAt(0) + userDetails.twitterName.charAt(1)}
                                            </div>
                                            <div className="flex flex-col ml-4">
                                                <div className="text-lg">{userDetails.twitterName}</div>
                                                <div className="text-sm">@{userDetails.twitterUserName}</div>
                                            </div>
                                        </div>
                                        <img
                                            width={30}
                                            src={DeleteIcon}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setTweetToDelete(tweet.id);
                                                setConfirmDelete(true);
                                            }}
                                        />
                                    </div>
                                    <div className="mt-4">{tweet.text}</div>
                                    <div className="mt-3 mb-3"> {formatDate(tweet.created_at)}</div>
                                    <div className="h-[1px] bg-divider" />
                                    <div className="flex gap-14 mt-3">
                                        <div className="flex gap-2">
                                            <img width={20} src={LikeIcon} />
                                            <div className="">{tweet.public_metrics.like_count}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <img width={25} src={CommentIcon} />
                                            <div className="">{tweet.public_metrics.reply_count}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <img width={25} src={RetweetIcon} />
                                            <div className="">{tweet.public_metrics.retweet_count}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <img width={25} src={ViewIcon} />
                                            <div className="">{tweet.public_metrics.impression_count}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <img width={25} src={BookmarkIcon} />
                                            <div className="">{tweet.public_metrics.bookmark_count}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-col w-[40%] rounded-xl border-[1px] p-8 bg-surface overflow-y-auto box-border">
                        <div className="flex bg-yellow w-28 h-28 justify-center items-center text-lg font-bold px-2 py-1 rounded-full uppercase">
                            {userDetails.twitterName.charAt(0) + userDetails.twitterName.charAt(1)}
                        </div>
                        <div className="flex flex-col ml-4 text-primary mt-4 mb-10">
                            <div className="text-2xl">{userDetails.twitterName}</div>
                            <div className="text-lg mb-4">@{userDetails.twitterUserName}</div>
                            <div className="h-[1px] bg-divider" />
                            <div className="flex flex-col mt-4 gap-6">
                                <div className="flex gap-8 items-center w-[60%] justify-between">
                                    <div className="text-xl text-primary">Followers</div>
                                    <div className="text-xl font-bold text-black">
                                        {profile?.public_metrics.followers_count}
                                    </div>
                                </div>
                                <div className="flex gap-8 items-center w-[60%] justify-between">
                                    <div className="text-xl text-primary">Following</div>
                                    <div className="text-xl font-bold text-black">
                                        {profile?.public_metrics.following_count}
                                    </div>
                                </div>
                                <div className="flex gap-8 items-center w-[60%] justify-between">
                                    <div className="text-xl text-primary">Total Likes</div>
                                    <div className="text-xl font-bold text-black">
                                        {profile?.public_metrics.like_count}
                                    </div>
                                </div>
                                <div className="flex gap-8 items-center w-[60%] justify-between">
                                    <div className="text-xl text-primary">Total Tweets</div>
                                    <div className="text-xl font-bold text-black">
                                        {profile?.public_metrics.tweet_count}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                isVisible={confirmDelete}
                setIsVisible={setConfirmDelete}
                title={'Are you sure?'}
                hideHeaderBorder={true}
                isModalClosable={true}
                overflow="auto"
            >
                <div className="p-2xl">
                    <div className="text-lg pb-xxs text-primary font-medium">
                        {'This would delete your post permanently.'}
                    </div>
                    <div className="text-base font-medium text-primary">{'Do you want to proceed?'}</div>
                    <div className="flex w-full gap-x-4 my-8 justify-center">
                        <div className="w-[30%]">
                            <Button
                                text={'Back'}
                                onClick={() => {
                                    setTweetToDelete('');
                                    setConfirmDelete(false);
                                }}
                                background={'bg-hoverEmerald'}
                            />
                        </div>
                        <div className="w-[30%]">
                            <Button
                                text={'Delete'}
                                onClick={deletePost}
                                background={'bg-errorText'}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Twitter;
