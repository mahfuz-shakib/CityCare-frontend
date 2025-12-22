import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isLoading: roleLoading, data: role = 'citizen' } = useQuery({
        queryKey: ['user-role', user?.email],
        queryFn: async () => {
            if (!user?.email) return 'citizen';
            const res = await axiosSecure.get(`/users/?email=${user.email}`);
            const userData = res.data?.[0];
            
            // Check if user is staff
            if (!userData || userData.role !== 'staff') {
                // Check staffs collection
                try {
                    const staffRes = await axiosSecure.get(`/staffs/?email=${user.email}`);
                    if (staffRes.data?.[0]) {
                        return 'staff';
                    }
                } catch (err) {
                    // Ignore error
                }
            }
            
            return userData?.role || 'citizen';
        },
        enabled: !!user?.email,
    })
    return { role, roleLoading };
};

export default useRole;