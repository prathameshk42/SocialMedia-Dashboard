import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChatIcon,
    CreatePostIcon,
    FacebookIcon,
    InstagramIcon,
    Logo,
    LogoutIcon,
    TodoIcon,
    TwitterIcon,
    UserIcon
} from '../assets';
import { useDispatch } from 'react-redux';
import { resetUser } from '../redux/UserSlice';
import { resetChat } from '../redux/ChatSlice';
import { resetTweet } from '../redux/TweetsSlice';

export type IElements = 'profile' | 'twitter' | 'dashboard' | 'chat' | 'todo' | 'post' | 'instagram' | 'facebook';

interface ISideBar {
    setCurrentTab: (tab: IElements) => void;
}

const SideBar: React.FC<ISideBar> = ({ setCurrentTab }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onClick = (tab: IElements) => {
        setCurrentTab(tab);
    };

    const onLogout = () => {
        dispatch(resetUser());
        dispatch(resetChat());
        dispatch(resetTweet());
        navigate('/login');
    };

    return (
        <div className="w-72 h-full min-h-screen bg-emerald text-white overflow-hidden">
            <div className="flex flex-col justify-between h-dvh">
                <div className="flex flex-col">
                    <div
                        className="flex items-center text-2xl cursor-pointer -ml-3 px-6 pt-6"
                        onClick={() => onClick('post')}
                    >
                        <img width={60} src={Logo} />
                        <div>Social Sync</div>
                    </div>
                    <div className="flex flex-col h-full">
                        <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('post')}
                        >
                            <img width={30} src={CreatePostIcon} />
                            <div>Create Post</div>
                        </div>
                        <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('twitter')}
                        >
                            <img width={30} src={TwitterIcon} />
                            <div>Twitter</div>
                        </div>
                        {/* <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('instagram')}
                        >
                            <img width={30} src={InstagramIcon} />
                            <div>Instagram</div>
                        </div> */}
                        <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('facebook')}
                        >
                            <img width={30} src={FacebookIcon} />
                            <div>Facebook</div>
                        </div>
                        <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('todo')}
                        >
                            <img width={30} src={TodoIcon} />
                            <div>Work Queue</div>
                        </div>
                        <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('chat')}
                        >
                            <img width={30} src={ChatIcon} />
                            <div>Smart Chat</div>
                        </div>
                        {/* <div
                            className="flex items-center gap-4 text-lg hover:bg-hoverEmerald px-6 py-3 cursor-pointer"
                            onClick={() => onClick('profile')}
                        >
                            <img width={30} src={UserIcon} />
                            <div>Profile</div>
                        </div> */}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-lg sticky bottom-0 cursor-pointer p-6" onClick={onLogout}>
                    <img width={30} src={LogoutIcon} />
                    <div>Logout</div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
