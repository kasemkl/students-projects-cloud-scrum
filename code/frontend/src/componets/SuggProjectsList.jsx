// MyComponent.jsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/projectslist.css';
import axios from 'axios';
import Loading from '../componets/Loading';
import NavDropdown from 'react-bootstrap/NavDropdown';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const SuggProjectsList = () => {
  const [data, setData] = useState([]);
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
      const response = await axios.get('http://127.0.0.1:8000/sugg-projects/');
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
}
  

  return (
    <div className='container'>
      <h1>Suggestion Projects List:</h1>
      {/* Add a dropdown or some UI to select the supervisor */}
      {/* For example, a select dropdown */}
      <NavDropdown title="Options" id="basic-nav-dropdown">

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