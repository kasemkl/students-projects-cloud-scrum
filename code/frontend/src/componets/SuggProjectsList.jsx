// MyComponent.jsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/projectslist.css';
import axios from 'axios';
import Loading from '../componets/Loading';
import NavDropdown from 'react-bootstrap/NavDropdown';
import useAxios from '../utils/useAxios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const SuggProjectsList = () => {
  const [data, setData] = useState([]);
  const api=useAxios()
  const [projectsBySupervisor, setProjectsBySupervisor] = useState({});
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFilterSupervisor, setSelectedFilterSupervisor] = useState(false);
  const [selectedFilterDepartment, setSelectedFilterDepartment] = useState(false);
  const [departments,setDepartments]=useState([])
  const [supervisors,setSupervisors]=useState([])

  const [projectsByDepartments,setProjectsByDepartments]=useState({})
  const fetchData = async () => {
    try {
      const response = await api.get('/sugg-projects/');
      const jsonData = response.data;
      console.log(jsonData);
      const rawData=response.data
      const dataArray = Object.keys(rawData).map(key => ({
        id: key,
        ...rawData[key],
      }));
        setData(dataArray)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);
  useEffect(() => {
    // Group projects by supervisor
    const groupedProjects = {};
    const groupedProjectsByDepartments={}
    const supervisorList=[]
    const departmentList=[]

    data.forEach((project) => {
      const supervisorId = project.supervisor_id;
      if (!groupedProjects[supervisorId]) {
        groupedProjects[supervisorId] = [];
        supervisorList.push({name:project.supervisor_name,id:project.supervisor_id})
      }
      const department = project.department;
      if (!groupedProjectsByDepartments[department]) {
        groupedProjectsByDepartments[department] = [];
        departmentList.push({name:project.department})
      }
      groupedProjectsByDepartments[department].push(project)
      groupedProjects[supervisorId].push(project);
    });
    setProjectsBySupervisor(groupedProjects);
    setProjectsByDepartments(groupedProjectsByDepartments);
    setDepartments(departmentList);
    setSupervisors(supervisorList)
    console.log(projectsByDepartments)
  }, [data]);
  const handleSupervisorChange = (value) => {
    setSelectedDepartment(null);
    setSelectedSupervisor(value);

  };


const handleDepartmentChange=(value)=>{ 
  setSelectedSupervisor(null)
  setSelectedDepartment(value)
  console.log(selectedDepartment," ",value)
}

const handleFilterDepartmentChange=()=>{ 
  setSelectedSupervisor(null)
  setSelectedDepartment(null)
  setSelectedFilterSupervisor(false)
  setSelectedFilterDepartment(true)
}

const handleFilterSupervisorChange=()=>{ 
  setSelectedSupervisor(null)
  setSelectedDepartment(null)
  setSelectedFilterSupervisor(true)
  setSelectedFilterDepartment(false)
}

const handleClear=()=>{
  setSelectedSupervisor(null)
  setSelectedDepartment(null)
  setSelectedFilterSupervisor(false)
  setSelectedFilterDepartment(false)
}

  const renderGroupedProjects = () => {
    if (selectedSupervisor) {
      // Render projects for the selected supervisor
      return (
        <div className='projects-list'>
          {projectsBySupervisor[selectedSupervisor]?.map((suggProject) => (
            <Card key={suggProject.id} formData={suggProject} />
          ))}
        </div>
      );
    }
    else if (selectedDepartment) {
      // Render projects for the selected supervisor
      return (
        <div className='projects-list'>
          {projectsByDepartments[selectedDepartment]?.map((suggProject) => (
            <Card key={suggProject.id} formData={suggProject} />
          ))}
        </div>
      );
    }
    else if (selectedFilterSupervisor){
    return (
      <div>
        {Object.keys(projectsBySupervisor).map((supervisorId) => (
          <div key={supervisorId}>
            <h2>Supervisor: {supervisorId}</h2>
            <div className='projects-list'>
              {projectsBySupervisor[supervisorId].map((suggProject) => (
                <Card key={suggProject.id} formData={suggProject} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );}
   else if (selectedFilterDepartment) {
    return (
      <div>
        {Object.keys(projectsByDepartments).map((department) => (
          <div key={department}>
            <h2>department: {department}</h2>
            <div className='projects-list'>
              {projectsByDepartments[department].map((suggProject) => (
                <Card key={suggProject.id} formData={suggProject} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  else {
    return (
      <div>
            <div className='projects-list'>
              {data.map((suggProject) => (
                <Card key={suggProject.id} formData={suggProject} />
              ))}
            </div>
          </div>
    );
  }
}
  

  return (
    <div className='container'>
      <h1>Suggestion Projects List:</h1>
      {/* Add a dropdown or some UI to select the supervisor */}
      {/* For example, a select dropdown */}
     <NavDropdown title={<span>{'Filter By '} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
</svg></span>} id="basic-nav-dropdown" className='filter'>

        <NavDropdown.Item onClick={()=>handleFilterDepartmentChange()}>Departments</NavDropdown.Item>
        <NavDropdown.Item onClick={()=>handleFilterSupervisorChange()}>Supervisors</NavDropdown.Item>
        <NavDropdown.Divider/>
      {supervisors.map((supervisor) => (
        <NavDropdown.Item
          eventKey={supervisor.id}
          key={supervisor.id}
          onClick={() => handleSupervisorChange(supervisor.id)}
        >
          Supervisor: {supervisor.name}
        </NavDropdown.Item>
      ))}
      <NavDropdown.Divider />
      {departments.map((department) => (
        <NavDropdown.Item
          eventKey={department.name}
          key={department.id}
          onClick={() => handleDepartmentChange(department.name)}
        >
          Department: {department.name}
        </NavDropdown.Item>
      ))}

<NavDropdown.Divider/>
      <NavDropdown.Item onClick={()=>handleClear()}>clear filter </NavDropdown.Item>
    </NavDropdown>

      <div className={data.length === 0 ? 'content-container' : ''}>
        {data.length > 0 ? (
          renderGroupedProjects()
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default SuggProjectsList;