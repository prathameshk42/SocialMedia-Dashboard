import React, { useEffect, useState } from 'react';
import { CubeLoader, SideBar } from '../../components';
import { IElements } from '../../components/SideBar';
import { Dashboard, Profile, Twitter, Chat, Todo, CreatePost, Instagram, Facebook } from './pages';
import useTwitter from '../../hooks/useTwitter';
import useInstagram from '../../hooks/useInstagram';
import useFacebook from '../../hooks/useFacebook';
import { useNavigate } from 'react-router-dom';

const SPAContainer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPage, setSelectedPage] = useState<IElements>('post');
    const { getTwitterAccessToken } = useTwitter();
    const { processCode } = useInstagram();
    const { processToken } = useFacebook();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const oauthToken = params.get('oauth_token');
        const oauthVerifier = params.get('oauth_verifier');
        const redirectCode = params.get('code');
        const accessToken = params.get('fbaccessToken');
        (async () => {
            if (oauthToken && oauthVerifier) {
                try {
                    setLoading(true);
                    await getTwitterAccessToken(oauthToken, oauthVerifier);
                } catch (error) {
                } finally {
                    window.close();
                    setLoading(false);
                }
            } else if (redirectCode) {
                try {
                    setLoading(true);
                    await processCode(redirectCode);
                } catch (error) {
                } finally {
                    window.close();
                    setLoading(false);
                }
            } else if (accessToken) {
                try {
                    setLoading(true);
                    await processToken(accessToken);
                } catch (error) {
                } finally {
                    setSelectedPage('facebook');
                    navigate('/dashboard', { replace: true });
                    setLoading(false);
                }
            }
        })();
    }, []);

    if (loading) {
        return (
            <div>
                <CubeLoader />
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden">
            <SideBar setCurrentTab={setSelectedPage} />
            <div className="flex w-full">
                {selectedPage === 'chat' && <Chat />}
                {selectedPage === 'dashboard' && <Dashboard />}
                {selectedPage === 'profile' && <Profile />}
                {selectedPage === 'twitter' && <Twitter />}
                {selectedPage === 'todo' && <Todo />}
                {selectedPage === 'post' && <CreatePost />}
                {selectedPage === 'instagram' && <Instagram />}
                {selectedPage === 'facebook' && <Facebook />}
            </div>
        </div>
    );
};

export default SPAContainer;
