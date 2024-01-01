import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import MessageCard from '../componets/MessageCard';
import Loading from '../componets/Loading';
import RenderContext from '../context/RenderContext';
import StudentProjectRequestCard from '../componets/StudentProjectRequestCard';

const Inbox = () => {
    const api = useAxios();
    const [messages, setMessages] = useState();
    const [Students_Requests, setStudents_Requests] = useState();
    const[isEmpty,setIsEmpty]=useState()
    const [effectRan,setEffectRan]=useState(false);
    const maxRuns = 1; // Set the maximum number of runs
    const [runCount, setRunCount] = useState(0);
    const {render}=useContext(RenderContext)
    useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await api.get('/students-requests/');
        console.log(response.data);
        setMessages(response.data);
            setRunCount((prevCount) => prevCount + 1);
          
      } catch (error) {
        console.log('Error during fetch:', error);
      }
    };
    const fetchStudentsRequestsData = async () => {
      try {
        let response = await api.get('/students-projects-requests/');
        console.log(response.data);
        setStudents_Requests(response.data);          
      } catch (error) {
        console.log('Error during fetch:', error);
      }
    };

  
        fetchData();
        fetchStudentsRequestsData();
   
  }, [render]);

  return (
    <div className='container'>
        <h1>Requets:</h1>
        
      { messages&&Object.keys(messages).length > 0 ?
      (<div>
      {  Object.entries(messages).map(([request_id, project]) => (
        <MessageCard key={request_id} project={project} request_id={request_id} url={`/update-students-requests/`}/>
        ))}
</div>)
      : Students_Requests&&Object.keys(Students_Requests).length > 0 ?
      (<div>
      {  Object.entries(Students_Requests).map(([request_id, project]) => (
        <StudentProjectRequestCard key={request_id} project={project} request_id={request_id} url={`/update-students-projects-requests/`}/>
        ))}
    </div>)

  : messages &&Students_Requests?<div>No Requests</div>:
      (<div className='content-container'>
          <Loading />
          </div>)
      }
    </div>
        );
};

export default Inbox;
