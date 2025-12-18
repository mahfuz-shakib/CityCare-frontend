import React,{ useRef} from 'react';
import Container from '../../../container/Container';
import CreateStaffForm from '../../../components/Form/CreateStaffForm';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const ManageStaffs = () => {
  const modalRef = useRef();

    const axiosSecure = useAxiosSecure();
      // const { data: issue, isLoading ,refetch} = useQuery({
      //   queryKey: ["staffs"],
      //   queryFn: async () => {
      //     const res = await axiosSecure.get("/staffs");
      //     return res.data;
      //   },
      // });
      const handleCreateStaff=()=>{
            modalRef.current.showModal();

      }
    return (
        <Container>
            <div className="text-right my-6">
                <button onClick={handleCreateStaff} className='btn btn-primary'>Create New staff</button>
            </div>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <h1 className="text-center font-bold mb-2 md:mb-3">Staff Information</h1>
          <CreateStaffForm modalRef={modalRef}/>
        </div>
      </dialog>
        </Container>
    );
};

export default ManageStaffs;