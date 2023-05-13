'use client';

import { pusherClient } from 'lib/pusher';
import { toPusherKey } from 'lib/utils';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

interface FriendRequestSidebarOptionsProps {
	sessionId: string;
	initialUnseenRequestCount: number;
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
	sessionId,
	initialUnseenRequestCount,
}) => {
	const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
		initialUnseenRequestCount
	);

	const friendRequestHandler = () => {
		setUnseenRequestCount((prev) => prev + 1);
	};

	const addedFriendHandler = () => {
		setUnseenRequestCount((prev) => prev - 1);
	};

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_requests`)
		);
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

		pusherClient.bind('incoming_friend_requests', friendRequestHandler);
		pusherClient.bind('new_friend', addedFriendHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
			pusherClient.unbind('new_friend', addedFriendHandler);
			pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
		};
	}, [sessionId]);

	return (
		<Link href="/home/requests" className="sidebar_link group">
			<div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
				<UserIcon className="w-4 h-4" />
			</div>
			<p className="truncate">Friend requests</p>

			{unseenRequestCount > 0 ? (
				<div className="sidebar_link_noti">{unseenRequestCount}</div>
			) : null}
		</Link>
	);
};

export default FriendRequestSidebarOptions;
