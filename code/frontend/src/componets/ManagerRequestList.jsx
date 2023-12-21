// RequestList.jsx
import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../utils/useAxios';
import Loading from './Loading';
import AuthContext from '../context/AuthContext';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [load, setLoad] = useState(false);
    const {user}=useContext(AuthContext)
    const name=user.first_name
    let api=useAxios()
    const fetchData = async () => {
        try {
            const response = await api.get('/manager-requests-list/');
            if (response.status === 200) {
              console.log('requests', response.data);
              const rawData=response.data
              const dataArray = Object.keys(rawData).map(key => ({id: key,...rawData[key],
              }));
                  setRequests(dataArray)
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(()=>{
        fetchData()
    },[load])

    const handleDecision = async (requestId, decision,name) => {
        // Make a PATCH request to update the status of the request
        console.log({ id:requestId,status: decision,user_name:name })
        try{
        let response=await api.patch('/manager-requests-list/',{
            id:requestId,
            status:decision,
            user_name:name
        })
        console.log(response.data)
        }
        catch (error) {
            // Handle errors
            console.error('Error updating request:', error);
        }
        setLoad(!load)
    };

    return (
        <div className='container'>
            <h2>Pending Requests :</h2>
            {requests.length > 0 ? (
              <div className=''>
                {requests.map(request => (
                  <div key={request.id}>
                        <div className="card" >
                          <div className="card-body">
                            <h3 className="card-title">{request.title}</h3>
                            <p className="card-text"><strong>Description:</strong> {request.description}</p>
                            <p className="card-text"><strong>goal:</strong> {request.goal}</p>
                            <p className="card-text"><strong>department:</strong> {request.department}</p>
                            <p className="card-text"><strong>supervisor:</strong> {request.supervisor_name}</p>
                          </div>
                          <div className=''>
                            <button className='btn btn-success' onClick={() => handleDecision(request.id, 'accepted',name)}>Accept</button>
                            <button className='btn btn-danger' onClick={() => handleDecision(request.id, 'rejected',name)}>Reject</button>
                          </div>
                        </div>
                    </div>
                ))}
            </div>):
            (<p className='paragraph'>No pending requests</p>) 
              }
        </div>
    );
};

export default RequestList;
