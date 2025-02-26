import { useState } from 'react';
import { createTwitterPost } from '../adapters';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../redux';
import { ITweet } from '../redux/TweetsSlice/types';
import { updateTweet } from '../redux/TweetsSlice';

const publicMetrics = {
    retweet_count: 0,
    reply_count: 0,
    like_count: 0,
    quote_count: 0,
    bookmark_count: 0,
    impression_count: 0
};

const nonPublicMetrics = {
    impression_count: 0,
    engagements: 0,
    user_profile_clicks: 0
};

const useCreatePost = () => {
    const dispatch = useDispatch();
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const userDetails = useSelector((state: ReduxState) => state.user);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const createPost = () => {
        setError('');
        if (!selectedPlatforms.length || !content) {
            setError('Please enter the mandatory fields');
            return;
        } else {
            try {
                selectedPlatforms.map(async (platform) => {
                    if (platform === 'twitter') {
                        setLoading(true);
                        const response = await createTwitterPost(
                            userDetails.twitterAccessToken,
                            userDetails.twitterAccessTokenSecret,
                            content
                        );
                        if (response.id) {
                            const newTweet: ITweet = {
                                text: content,
                                created_at: new Date().toString(),
                                id: response.id,
                                edit_history_tweet_ids: [''],
                                public_metrics: publicMetrics,
                                non_public_metrics: nonPublicMetrics
                            };
                            dispatch(updateTweet(newTweet));
                            setSuccess(true);
                            setLoading(false);
                        }
                    }
                });
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
    };

    const selectPlatform = (value: string) => {
        const exists = selectedPlatforms.includes(value);
        if (exists) {
            const updatedList = selectedPlatforms.filter((item) => item !== value);
            setSelectedPlatforms(updatedList);
        } else {
            const updatedList = selectedPlatforms.concat(value);
            setSelectedPlatforms(updatedList);
        }
    };

    return {
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
    };
};

export default useCreatePost;
