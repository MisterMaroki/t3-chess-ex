import FriendRequestSidebarOptions from 'components/FriendRequestSidebarOptions';
import { Icons } from 'components/Icons';
import MainNav from 'components/MainNav';
import MobileChatLayout from 'components/MobileChatLayout';
import SidebarChatList from 'components/SidebarChatList';
import SignOutButton from 'components/SignOutButton';
import SoundOnOffButton from 'components/SoundOnOffButton';
import { Button } from 'components/ui/Button';
import { getFriendsByUserId } from 'helpers/get-friends-by-user-id';
import { fetchRedis } from 'helpers/redis';
import { authOptions } from 'lib/auth';
import { SidebarOption } from '@/types/typings';
import { getServerSession } from 'next-auth';

import { redirect } from 'next/navigation';
import { Fragment, ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

// Done after the video and optional: add page metadata
export const metadata = {
	title: 'GlassBoard | home',
	description: 'Your home',
};

const sidebarOptions: SidebarOption[] = [
	{
		id: 1,
		name: 'Add friend',
		href: '/home/add',
		Icon: 'UserPlus',
	},
];

const Layout = async ({ children }: LayoutProps) => {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/');

	const friends = await getFriendsByUserId(session.user.id);

	const unseenRequestCount = (
		(await fetchRedis(
			'smembers',
			`user:${session.user.id}:incoming_friend_requests`
		)) as User[]
	).length;

	return (
		<div className="flex flex-col w-full h-full md:flex-row">
			<div className="md:hidden">
				<MobileChatLayout
					friends={friends}
					session={session}
					sidebarOptions={sidebarOptions}
					unseenRequestCount={unseenRequestCount}
				/>
			</div>
			<MainNav
				friends={friends}
				session={session}
				sidebarOptions={sidebarOptions}
				unseenRequestCount={unseenRequestCount}
			/>
			<aside className="main_content">{children}</aside>
		</div>
	);
};

export default Layout;
