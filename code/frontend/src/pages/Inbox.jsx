import React, { useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import MessageCard from '../componets/MessageCard';
import Loading from '../componets/Loading';
const Inbox = () => {
  const api = useAxios();
  const [messages, setMessages] = useState();
    const[isEmpty,setIsEmpty]=useState()


    const [effectRan,setEffectRan]=useState(false);
  const maxRuns = 1; // Set the maximum number of runs
  const [runCount, setRunCount] = useState(0);
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

    if (runCount < maxRuns) {
        fetchData();
      }
  }, []);

  return (
    <div className='container'>
        <h1>Requets:</h1>
        
      { messages&&Object.keys(messages).length > 0 ?
      (<div>
      {  Object.entries(messages).map(([request_id, project]) => (
          <MessageCard key={request_id} project={project} request_id={request_id} url={`/update-students-requests/`}/>
          ))}
    </div> 
  ): messages?<div>No Requests</div>:
      (<div className='content-container'>
          <Loading />
          </div>)
      }
    </div>
        );
};

export default Inbox;
