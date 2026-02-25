'use client';

import { Button } from '@/components/Button';
import { links } from '@/constants/links.constant';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin.slice';
import { ResponseBase } from '@/types/response/response-base';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const isAdmin = useAppSelector((state) => state.isAdmin);

    async function signOut() {
        const response: ResponseBase = await (
            await fetch(`/api/admin/sign-out`, {
                method: 'POST'
            })
        ).json();

        if (response.isSuccess)
            dispatch(isAdminActions.set(false));
    }

    // return ( // hamburger menu on mobile
    //     <nav className="fixed top-0 z-50 w-full h-auto flex flex-col justify-center items-center bg-black">
    //         {isAdmin && (
    //             <div className="absolute left-4 top-0.5 flex flex-col justify-center items-center">
    //                 <p className="text-s text-red-500">Admin</p>
    //                 <Button onClick={signOut} variant={ButtonVariant.PRIMARY}>
    //                     SignOut
    //                 </Button>
    //             </div>
    //         )}

    //         <div className="w-full h-auto bg-black flex justify-end md:hidden py-2 pr-2">
    //             <Button onClick={() => setIsOpen((prev) => !prev)} variant={ButtonVariant.PRIMARY}>
    //                 {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
    //             </Button>
    //         </div>

    //         <div
    //             className={`w-full h-auto px-4 pb-4 md:p-4 bg-black shadow-2xl flex md:flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-white text-sm
    //                 ${isOpen ? 'flex' : 'hidden'}`}
    //         >
    //             {links.map((link, index) => (
    //                 <Link
    //                     key={`link-${index}-${link.name}`}
    //                     href={link.href}
    //                     onClick={() => setIsOpen(false)}
    //                     className="hover:text-gray-400 duration-250"
    //                 >
    //                     <p>{link.name}</p>
    //                 </Link>
    //             ))}
    //         </div>
    //     </nav>
    // );

    return (
        <nav className="fixed top-0 z-50 w-full h-auto flex flex-col justify-center items-center bg-black border-b border-white/10">
            {isAdmin && (
                <div className="absolute left-2 md:left-6 top-1 flex flex-col justify-center items-center">
                    <p className="text-[10px] text-red-500 uppercase font-bold">Admin</p>
                    <Button onClick={signOut} variant={ButtonVariant.PRIMARY}>
                        SignOut
                    </Button>
                </div>
            )}

            <div className="w-full h-auto p-4 flex flex-row justify-center items-center gap-8 md:gap-12 text-white text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                {links.map((link, index) => (
                    <Link
                        key={`link-${index}-${link.name}`}
                        href={link.href}
                        className="hover:text-gray-400 transition-colors duration-250 flex-shrink-0"
                    >
                        <p>{link.name}</p>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
