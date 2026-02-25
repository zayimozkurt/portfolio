'use client';

import { Contacts } from '@/components/contacts/Contacts';
import LoadingSpinner from '@/components/LoadingSpinner';
import NavBar from '@/components/NavBar';
import { NAVBAR_HEIGHT } from '@/constants/navbar-height.constant';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin.slice';
import { userActions } from '@/store/slices/user.slice';
import React, { useEffect, useState } from 'react';

export default function LayoutClient({ children, isAuthorized }: { children: React.ReactNode; isAuthorized: boolean }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await dispatch(userActions.refresh());
            await dispatch(isAdminActions.set(isAuthorized));
            setIsReady(true);
        })();
    }, [dispatch, isAuthorized]);

    return (
        <div className="w-full h-full flex flex-col justify-start items-center">
            <NavBar />
            <Contacts contacts={user.contacts} />
            {isReady ? (
                <div className="w-full h-full p-4" style={{ paddingTop: NAVBAR_HEIGHT }}>
                    {children}
                </div>
            ) : (
                <LoadingSpinner isHidden={false} />
            )}
        </div>
    );
}
