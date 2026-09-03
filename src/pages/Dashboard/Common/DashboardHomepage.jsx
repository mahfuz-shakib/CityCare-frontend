import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import AdminHome from '../Admin/AdminHome';
import StaffHome from '../Staff/StaffHome';
import CitizenHome from '../Citizen/CitizenHome';
import ListingSkeleton from '../../../components/ListingSkeleton';

const DashboardHomepage = () => {
    const {loading} = useAuth();
    const { role, roleLoading } = useRole()
    if (roleLoading || loading) {
        return <ListingSkeleton />;
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
