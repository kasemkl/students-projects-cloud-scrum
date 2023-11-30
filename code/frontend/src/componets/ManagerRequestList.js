// RequestList.jsx
import React, { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [load, setLoad] = useState(false);
    let api=useAxios()
    const fetchData = async () => {
        try {
            const response = await api.get('/manager-requests-list/');
            if (response.status === 200) {
                console.log('requests', response.data);
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(()=>{
        fetchData()
    },[load])

    const handleDecision = async (requestId, decision) => {
        // Make a PATCH request to update the status of the request
        console.log({ id:requestId,status: decision })
        try{
        let response=await api.patch('/manager-requests-list/',{
            id:requestId,
            status:decision
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
        <div>
            <h2>Pending Requests</h2>
            <ul>
                {requests.map(request => (
                    <li key={request.id}>
                        {request.title} - {request.department.name}
                        <button onClick={() => handleDecision(request.id, 'accepted')}>Accept</button>
                        <button onClick={() => handleDecision(request.id, 'rejected')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RequestList;
