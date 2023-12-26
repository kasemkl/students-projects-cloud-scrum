// RequestList.jsx
import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../utils/useAxios';
import Loading from '../componets/Loading';
import AuthContext from '../context/AuthContext';
import ConfirmDialog from '../componets/ConfirmDialog';
import Dialog from '../componets/Dialog';
import SuggRequestCard from '../componets/SuggRequestCard';
import RenderContext from '../context/RenderContext';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [load, setLoad] = useState(false);
    const {user}=useContext(AuthContext)
    const[isEmpty,setIsEmpty]=useState(false)
    const name=user.first_name
    let api=useAxios()
    const {render,setRender}=useContext(RenderContext)

    const fetchData = async () => {
        try {
            const response = await api.get('/manager-requests-list/');
            if (response.status === 200) {
                const rawData=response.data
                const dataArray = Object.keys(rawData).map(key => ({id: key,...rawData[key],
                }));
                setRequests(dataArray)
                // console.log('requests', requests);
                  if(requests.length===0){
                    setIsEmpty(true)
                  }
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(()=>{
        fetchData()
    },[render])

  

    return (
      <div className="container">
        <h2>Pending Requests :</h2>
        {requests.length>0 ? (
          <div className="">
            {requests.map((request) => (
              <div key={request.id}>
                <SuggRequestCard request={request} />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <p className="paragraph">No pending requests</p>
        ) : (
          <div className="content-container">
            <Loading />
          </div>
        )}
      </div>
    );
};

export default RequestList;
