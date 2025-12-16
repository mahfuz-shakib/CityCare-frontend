import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const IssueDetails = ({params}) => {
    const {_id}=params;
    const axiosSecure = useAxiosSecure();
      const { data: issue = {}, isLoading } = useQuery({
        queryKey: ["issue",_id],
        queryFn: async () => {
          const res = await axiosSecure.get(`/issues/${_id}`);
          return res.data;
        },
      });
    return (
        <div>
            
        </div>
    );
};

export default IssueDetails;