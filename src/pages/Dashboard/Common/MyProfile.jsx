import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import AdminProfile from '../Admin/AdminProfile';
import StaffProfile from '../Staff/StaffProfile';
import CitizenProfile from '../Citizen/CitizenProfile';
import Loader from '../../../components/Loader';

const MyProfile = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { role, roleLoading } = useRole();

    if (roleLoading || loading) {
        return <Loader />;
    }

    if (role === 'admin') {
        return <AdminProfile />;
    } else if (role === 'staff') {
        return <StaffProfile />;
    } else {
        return <CitizenProfile />;
    }
};

export default MyProfile;
