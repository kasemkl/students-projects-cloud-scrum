import React, { useEffect, useState,useContext } from 'react';
import useAxios from '../utils/useAxios';
import MessageCard from '../componets/MessageCard';
import Loading from '../componets/Loading';
import '../styles/style.css'
import RenderContext from '../context/RenderContext';


const SupervisorInbox = () => {
  const api = useAxios();
  const [messages, setMessages] = useState();
    const[isEmpty,setIsEmpty]=useState()
    const {render,setRender}=useContext(RenderContext)


  const [effectRan, setEffectRan] = useState(false);
  const maxRuns=1; 
  const [runCount, setRunCount] = useState(0);
  useEffect(()=>{
    setRunCount(0);
  },[render])

  useEffect(() => {
    console.log(runCount,'llll',render)
    const fetchData = async () => {
      try {
        let response = await api.get('/requests-to-supervisors/');
        console.log(response.data);
        setMessages(response.data);
        setRunCount((prevCount) => prevCount + 1);
        if (Array.isArray(response.data) && response.data.length===0) {
          setIsEmpty(true)
          console.log(isEmpty)
        } else if (typeof response.data === 'object' && response.data !== null&&Object.keys(response.data).length===0) {
          setIsEmpty(true)
        }
      } catch (error) {
        console.log('Error during fetch:', error);
      }
    };

    if (runCount < maxRuns) {
        fetchData();
      } 
  }, [runCount]);

  return (
      <div className='container'>
        <h1>Requests:</h1>
      { messages&&Object.keys(messages).length > 0 ?
      (<div>
      {  Object.entries(messages).map(([request_id, project]) => (
          <MessageCard key={request_id} project={project} request_id={request_id} url={`/requests-to-supervisors/`}/>
          ))}
    </div> 
  ): isEmpty?<div>No Reequests Projects</div>:
      (<div className='content-container'>
          <Loading />
          </div>)
      }
    </div>
        );
};

export default SupervisorInbox;
