import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../redux';
import {
    deleteTwitterPost,
    fetchTweets,
    fetchTwitterAccessToken,
    fetchTwitterProfile,
    fetchTwitterRequestToken,
    fetchTwitterUser,
    fetchUserDetails,
    updateTwitterCreds
} from '../adapters';
import { updateUserDetails } from '../redux/UserSlice';
import { useEffect, useState } from 'react';
import { deleteTweet, updateTweets } from '../redux/TweetsSlice';

const useTwitter = () => {
    const dispatch = useDispatch();
    const userDetails = useSelector((state: ReduxState) => state.user);
    const [loading, setLoading] = useState<boolean>(false);
    const [screenLoader, setScreenLoader] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const tweets = useSelector((state: ReduxState) => state.tweet);
    const [tweetToDelete, setTweetToDelete] = useState<string>('');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(() => {
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    useEffect(() => {
        if (isFocused && !userDetails.twitterAccessToken && !userDetails.twitterAccessTokenSecret) {
            (async () => {
                try {
                    const userData: any = await fetchUserDetails(userDetails.email);
                    if (userData) {
                        const {
                            twitterAccessToken,
                            twitterAccessTokenSecret,
                            twitterUserName,
                            twitterName,
                            twitterId
                        } = userData;
                        dispatch(
                            updateUserDetails({
                                twitterAccessToken,
                                twitterAccessTokenSecret,
                                twitterUserName,
                                twitterName,
                                twitterId
                            })
                        );
                    }
                } catch (error) {
                    setScreenLoader(false);
                }
            })();
        }
    }, [isFocused]);

    useEffect(() => {
        (async () => {
            const lastFetched = new Date(tweets.fetchedAt);
            const currentTime = new Date();
            const timeDifference: number = currentTime.getTime() - lastFetched.getTime();
            const canFetch = tweets.fetchedAt ? timeDifference > 15 * 60 * 1000 : true;
            if (isAuthenticated && canFetch && isFocused) {
                const getProfile = await fetchTwitterProfile(
                    userDetails.twitterAccessToken,
                    userDetails.twitterAccessTokenSecret
                );
                const getTweets = await fetchTweets(
                    userDetails.twitterAccessToken,
                    userDetails.twitterAccessTokenSecret,
                    userDetails.twitterId
                );
                dispatch(updateTweets({ tweets: getTweets, profile: getProfile }));
            }
        })();
    }, [isAuthenticated]);

    useEffect(() => {
        if (userDetails.twitterAccessToken && userDetails.twitterAccessTokenSecret) {
            setIsAuthenticated(true);
        }
    }, [userDetails]);

    const onTwitterClick = async () => {
        try {
            setLoading(true);
            const response = await fetchTwitterRequestToken();
            setLoading(false);
            const twitterAuthUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${response.authToken}`;
            window.open(twitterAuthUrl, 'twitterAuth', 'width=600,height=600');
        } catch (error) {
            setLoading(false);
            console.error('Error initiating Twitter login:', error);
        }
    };

    const getTwitterAccessToken = async (oauthToken: string, oauthVerifier: string) => {
        try {
            const response = await fetchTwitterAccessToken(oauthToken, oauthVerifier);
            if (response.accessToken && response.accessTokenSecret) {
                const { accessToken, accessTokenSecret } = response;
                const twitterUser = await fetchTwitterUser(accessToken, accessTokenSecret);
                const { username, name, id } = twitterUser;
                await updateTwitterCreds(userDetails.userId, accessToken, accessTokenSecret, username, name, id);
            }
        } catch (error) {
            console.error('Error getting Twitter access token:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date: Date = new Date(dateString);
        const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedTime: string = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
        const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate: string = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

        return `${formattedTime} · ${formattedDate}`;
    };

    const deletePost = async () => {
        try {
            setLoading(true);
            const response = await deleteTwitterPost(
                userDetails.twitterAccessToken,
                userDetails.twitterAccessTokenSecret,
                tweetToDelete
            );
            if (response.deleted) {
                setLoading(false);
                setConfirmDelete(false);
                dispatch(deleteTweet(tweetToDelete));
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return {
        onTwitterClick,
        getTwitterAccessToken,
        loading,
        screenLoader,
        isAuthenticated,
        tweets,
        formatDate,
        deletePost,
        tweetToDelete,
        setTweetToDelete,
        confirmDelete,
        setConfirmDelete
    };
};

export default useTwitter;
