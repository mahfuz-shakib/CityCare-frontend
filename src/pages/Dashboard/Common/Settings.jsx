import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import AdminProfile from '../Admin/AdminProfile';
import StaffProfile from '../Staff/StaffProfile';
import CitizenProfile from '../Citizen/CitizenProfile';
import Loader from '../../../components/Loader';

const Settings = () => {
    const { loading } = useAuth();
    // const axiosSecure = useAxiosSecure();
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

export default Settings;