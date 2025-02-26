import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import FirebaseProvider from '../adapters/provider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../redux/UserSlice';
import { ReduxState } from '../redux';
import { createUser, fetchUserDetails } from '../adapters';

const useLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [signUp, setSignUp] = useState<boolean>(false);
    const user = useSelector((state: ReduxState) => state.user);
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [registration, setRegistration] = useState<boolean>(false);

    useEffect(() => {
        if (user?.email && user?.isVerified) {
            navigate('/dashboard');
        }
    }, [user]);

    const signInWithGoogle = () => {
        setError('');
        setLoading(true);
        try {
            const auth = getAuth(FirebaseProvider);
            const provider = new GoogleAuthProvider();

            signInWithPopup(auth, provider)
                .then(async (result) => {
                    const user = result.user;
                    if (user.email && user.emailVerified) {
                        const userData: any = await fetchUserDetails(user.email);
                        if (userData) {
                            const { name, age, gender, userId } = userData;
                            dispatch(
                                updateUserDetails({
                                    email: userData.email,
                                    isVerified: user.emailVerified,
                                    name,
                                    age,
                                    gender,
                                    userId
                                })
                            );
                        } else {
                            setError('User not registered. Please create an account to continue.');
                        }
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    setError(error.message);
                });
        } catch (error) {
            setLoading(false);
            setError('Something went wrong! Please try again later.');
        }
    };

    const clearForm = () => {
        setName('');
        setAge('');
        setEmail('');
        setGender('');
    };

    const onCreateAccount = () => {
        clearForm();
        setError('');
        setSignUp(true);
    };

    const clearError = () => setError('');

    const accountExists = () => {
        clearForm();
        setError('');
        setSignUp(false);
    };

    const onSignup = async () => {
        setError('');
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!name || !age || !gender || !email) {
            setError('Please enter all the above details');
            return;
        } else if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return;
        } else {
            try {
                setLoading(true);
                const rsp = await createUser(name, age, gender, email);
                if (rsp === 'Success') {
                    setLoading(false);
                    setRegistration(true);
                    setSignUp(false);
                }
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
    };

    return {
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
    };
};

export default useLogin;
