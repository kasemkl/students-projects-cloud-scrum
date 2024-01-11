import React, { useEffect ,useState} from 'react'
import useAxios from '../utils/useAxios';
import Dialog from '../componets/Dialog';

const AddCommittee = () => {
    let api=useAxios()
    const [supervisors, setSupervisors] = useState([]);
    const [formData, setFormData] = useState({
        supervisor_id:'',
      });
      const [modalShow, setModalShow] = React.useState(false);
    const [modalText, setModalText] = useState({
      title: 'Processing',
      text: 'please wait a second...'
    });

    useEffect(()=>{
        const fetchSupervisorsData = async () => {
            try {
                const response = await api.get('/supervisors/');
                if (response.status === 200) {
                    console.log('departments', response.data);
              setSupervisors(response.data)
              console.log(supervisors)
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
        fetchSupervisorsData();
    },[])

    const handleSelectSupervisor=(e)=>{
        console.log(e.target.value)
        setFormData({...formData,supervisor_id:parseInt(e.target.value,10)})
      }

      const handleSubmit = async(e) => {
        // Make a POST request to the Django API endpoint
        e.preventDefault(); // Prevent the default form submission behavior
        setModalShow(true)
        console.log('formmm',formData);
        try{
          let response=await api.post('/add-committee/',formData)
          console.log(response.data)
          setModalText({title:response.data.title,text:response.data.text})
          setModalShow(true)
          setFormData({
            supervisor_id:'',
        })
      
      }
          catch (error) {
              // Handle errors
              console.error('Error updating request:', error);
          }
      };

  return (
    <div>
        <Dialog
        title={modalText.title}
        text={modalText.text}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setModalText({
            title: 'Processing',
            text: 'please wait a second...'
          });
        }}
      />
        <h2>Add Committee:</h2>
        <form className='request' onSubmit={handleSubmit}>
            <fieldset>
        <h3>Committee:</h3>
       <label htmlFor="supervisor">Select a supervisor:</label>
        <select
                id="supervisor"
                className="form-select "
                value={formData.supervisor_id}
                onChange={handleSelectSupervisor}
                >
                <option value="" disabled>Select a Supervisor</option>
                {supervisors.map(supervisor => (
                    <option key={supervisor.university_id} value={supervisor.university_id}>
                    Dr. {supervisor.first_name} {supervisor.last_name}
                    </option>
                ))}
                </select>
        <button type='submit' className='btn btn-primary'>Add</button>
                </fieldset>
    </form>
    </div>
  )
}

export default AddCommittee
