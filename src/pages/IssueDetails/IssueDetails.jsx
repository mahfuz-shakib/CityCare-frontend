import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import Container from '../../container/Container';

const IssueDetails = () => {
    const {_id}=useParams();
    const axiosSecure = useAxiosSecure();
      const { data: issue = {}, isLoading } = useQuery({
        queryKey: ["issue",_id],
        queryFn: async () => {
          const res = await axiosSecure.get(`/issues/${_id}`);
          return res.data;
        },
      });
    return (
        <Container>
            <h1>hellow</h1>
        </Container>
    );
};

export default IssueDetails;