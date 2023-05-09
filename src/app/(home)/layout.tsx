import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions';
import { Icons } from '@/components/Icons';
import MobileChatLayout from '@/components/MobileChatLayout';
import SidebarChatList from '@/components/SidebarChatList';
import SignOutButton from '@/components/SignOutButton';
import SoundOnOffButton from '@/components/SoundOnOffButton';
import Button from '@/components/ui/Button';
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { SidebarOption } from '@/types/typings';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

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
	console.log('friends', friends);

	const unseenRequestCount = (
		(await fetchRedis(
			'smembers',
			`user:${session.user.id}:incoming_friend_requests`
		)) as User[]
	).length;
	console.log(
		'🚀 ~ file: layout.tsx:48 ~ Layout ~ unseenRequestCount:',
		unseenRequestCount
	);

	return (
		<div className="flex w-full h-full">
			<div className="md:hidden">
				<MobileChatLayout
					friends={friends}
					session={session}
					sidebarOptions={sidebarOptions}
					unseenRequestCount={unseenRequestCount}
				/>
			</div>

			<div className="z-50 flex-col hidden h-full max-w-sm overflow-y-auto border-r border-gray-200 w-fit shrink-0 order-0 glassy md:flex grow gap-y-5">
				<Link href="/chess" className="flex items-center h-16 shrink-0">
					<span className="logo_text">
						GlassBoard <span className="text-6xl purple_gradient">♗</span>
					</span>
				</Link>

				<Link href="/chess">
					<Button>Play Chess</Button>
				</Link>

				<SoundOnOffButton />
				{friends.length > 0 ? (
					<div className="text-xs font-semibold leading-6 text-gray-400">
						Your chats
					</div>
				) : null}

				<nav className="flex flex-col flex-1">
					<ul role="list" className="flex flex-col flex-1 gap-y-7">
						<li>
							<SidebarChatList sessionId={session.user.id} friends={friends} />
						</li>
						<li>
							<div className="text-xs font-semibold leading-6 text-gray-400">
								Overview
							</div>

							<ul role="list" className="mt-2 -mx-2 space-y-1">
								{sidebarOptions.map((option) => {
									const Icon = Icons[option.Icon];
									return (
										<li key={option.id}>
											<Link href={option.href} className="sidebar_link group">
												<span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
													<Icon className="w-4 h-4" />
												</span>

												<span className="truncate">{option.name}</span>
											</Link>
										</li>
									);
								})}

								<li>
									<FriendRequestSidebarOptions
										sessionId={session.user.id}
										initialUnseenRequestCount={unseenRequestCount}
									/>
								</li>
							</ul>
						</li>

						<li className="flex items-center mt-auto -ml-6">
							<div className="flex items-center flex-1 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-4">
								<div className="relative w-8 h-8 glassy">
									<Image
										fill
										sizes="100px"
										referrerPolicy="no-referrer"
										className="rounded-full"
										src={session.user.image || ''}
										alt="Your profile picture"
									/>
								</div>

								<span className="sr-only">Your profile</span>
								<div className="flex flex-col">
									<span aria-hidden="true">{session.user.name}</span>
									<span className="text-xs text-zinc-400" aria-hidden="true">
										{session.user.email}
									</span>
								</div>
							</div>

							<SignOutButton className="h-full aspect-square" />
						</li>
					</ul>
				</nav>
			</div>

			<aside className="container w-full max-h-full pt-20 md:pt-12 ">
				{children}
			</aside>
		</div>
	);
};

export default Layout;
