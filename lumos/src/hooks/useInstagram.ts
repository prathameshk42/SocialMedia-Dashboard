import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../redux';
import { fetchInstaAccessToken, fetchUserDetails, updateInstaToken } from '../adapters';
import { updateUserDetails } from '../redux/UserSlice';

const useInstagram = () => {
    const dispatch = useDispatch();
    const userDetails = useSelector((state: ReduxState) => state.user);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(true);
    const [screenLoader, setScreenLoader] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const redirectURL = `https://www.facebook.com/v17.0/dialog/oauth?client_id=1524681702259855&redirect_uri=http://localhost:5173/dashboard&scope=instagram_basic,pages_show_list&response_type=code`;

    const onLogin = () => {
        window.open(redirectURL, 'instagramAuth', 'width=600,height=600');
    };

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
        if (isFocused && !userDetails.instaAccessToken) {
            (async () => {
                try {
                    const userData: any = await fetchUserDetails(userDetails.email);
                    if (userData) {
                        const { instaAccessToken } = userData;
                        dispatch(updateUserDetails({ instaAccessToken }));
                    }
                } catch (error) {
                    setScreenLoader(false);
                }
            })();
        }
    }, [isFocused]);

    useEffect(() => {
        if (userDetails.instaAccessToken) {
            setIsAuthenticated(true);
        }
    }, [userDetails]);

    const processCode = async (code: string) => {
        const response = await fetchInstaAccessToken(code);
        await updateInstaToken(userDetails.userId, response.access_token);
    };

    return { isAuthenticated, onLogin, processCode, loading };
};

export default useInstagram;
