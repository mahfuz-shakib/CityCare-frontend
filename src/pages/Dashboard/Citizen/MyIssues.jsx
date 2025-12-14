import React from 'react';
import useAuth from '../../../hooks/useAuth';

const MyIssues = () => {
    // const axiosSecure = useAxiosSecure()
    const {user} = useAuth
    // const {data:issues=[]}=useQuery({
    //     queryKey:['issues']
    //     queryFn:()=>
    // })
    return (
        <div>
            <h1>citizen: my issues</h1>
        </div>
    );
};

export default MyIssues;