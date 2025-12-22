import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import AdminHome from '../Admin/AdminHome';
import StaffHome from '../Staff/StaffHome';
import CitizenHome from '../Citizen/CitizenHome';
import Loader from '../../../components/Loader';

const DashboardHomepage = () => {
    const { user ,loading} = useAuth();
    const axiosSecure = useAxiosSecure();
    const { role, roleLoading } = useRole()
    // const { data: userData, isLoading } = useQuery({
    //     queryKey: ['users', user?.email],
    //     queryFn: async () => {
    //         const res = await axiosSecure.get(`/users/?email=${user?.email}`);
    //         return res.data?.[0];
    //     },
    //     enabled: !!user?.email,
    // });

    if (roleLoading || loading) {
        return <Loader />;
    }
    if (role === 'admin') {
        return <AdminHome />;
    } else if (role === 'staff') {
        return <StaffHome />;
    } else {
        return <CitizenHome />;
    }
};

export default DashboardHomepage;
