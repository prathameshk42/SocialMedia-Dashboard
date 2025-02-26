import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../redux';
import { fetchFbProfile, fetchUserDetails, updateFbToken, URL } from '../adapters';
import { updateUserDetails } from '../redux/UserSlice';
import { updateFbProfile } from '../redux/FbSlice';

const useFacebook = () => {
    const dispatch = useDispatch();
    const userDetails = useSelector((state: ReduxState) => state.user);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [screenLoader, setScreenLoader] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const profile = useSelector((state: ReduxState) => state.fb);

    const onLogin = () => {
        const redirectURL = `${URL}/facebookAuth`;
        window.open(redirectURL, '_self', 'width=600,height=600');
    };

    useEffect(() => {
        (async () => {
            try {
                setScreenLoader(true);
                const userData: any = await fetchUserDetails(userDetails.email);
                if (userData) {
                    const { fbAccessToken } = userData;
                    const fbProfile = await fetchFbProfile(fbAccessToken);
                    dispatch(updateFbProfile(fbProfile));
                    dispatch(updateUserDetails({ fbAccessToken }));
                }
            } catch (error) {
                setScreenLoader(false);
            } finally {
                setScreenLoader(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (userDetails.fbAccessToken) {
            setIsAuthenticated(true);
        }
    }, [userDetails]);

    const processToken = async (token: string) => {
        await updateFbToken(userDetails.userId, token);
    };

    const formatDate = (dateString: string) => {
        const date: Date = new Date(dateString);
        const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedTime: string = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
        const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate: string = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

        return `${formattedTime} · ${formattedDate}`;
    };

    return { isAuthenticated, onLogin, processToken, loading, screenLoader, profile, formatDate };
};

export default useFacebook;
