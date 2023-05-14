import { SidebarOption } from '@/types/typings';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import FriendRequestSidebarOptions from './FriendRequestSidebarOptions';
import { Icons } from './Icons';
import SidebarChatList from './SidebarChatList';
import SignOutButton from './SignOutButton';
import SoundOnOffButton from './SoundOnOffButton';
import { Button } from './ui/Button';

interface MainNavProps {
	friends: User[];
	session: Session;
	sidebarOptions: SidebarOption[];
	unseenRequestCount: number;
}

const MainNav: FC<MainNavProps> = ({
	friends,
	session,
	sidebarOptions,
	unseenRequestCount,
}) => {
	return (
		<div className="flex-col hidden h-full max-w-sm p-6 overflow-y-auto border-r-2 border-gray-200 w-fit shrink-0 order-0 glassy_bg md:flex grow gap-y-5">
			<Link href="/home" className="flex items-center h-16 shrink-0">
				<span className="logo_text">
					Glassboard <span className="text-5xl purple_gradient">♗</span>
				</span>
			</Link>

			<Link href="/chess">
				<Button>Play Chess</Button>
			</Link>

			<nav className="flex flex-col flex-1">
				<ul role="list" className="flex flex-col flex-1 gap-y-7">
					<li>
						{friends.length > 0 ? (
							<div className="text-xs font-semibold leading-6 text-gray-400">
								Your chats
							</div>
						) : null}
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

					<div className="flex flex-col gap-4 mt-auto">
						<SoundOnOffButton />
						<li className="flex items-center -ml-6">
							<div className="flex items-center flex-1 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-4">
								<div className="relative w-8 h-8">
									<Image
										fill
										sizes="100px"
										referrerPolicy="no-referrer"
										className="rounded-full"
										src={session.user?.image || '/avatar.svg'}
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
					</div>
				</ul>
			</nav>
		</div>
	);
};

export default MainNav;
