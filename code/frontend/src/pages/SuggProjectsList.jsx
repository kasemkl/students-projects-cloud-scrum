import React, { useContext, useEffect, useRef, useState } from 'react';
import Card from '../componets/Card';
import '../styles/projectslist.css';
import axios from 'axios';
import Loading from '../componets/Loading';
import NavDropdown from 'react-bootstrap/NavDropdown';
import useAxios from '../utils/useAxios';
import ReactPaginate from 'react-paginate';
import UserInfoContext from '../context/UserInfoContext';
import RenderContext from '../context/RenderContext';

const SuggProjectsList = () => {
  const {userInfo}=useContext(UserInfoContext)
  const [data, setData] = useState([]);
  const api = useAxios();
  const [projectsBySupervisor, setProjectsBySupervisor] = useState({});
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFilterSupervisor, setSelectedFilterSupervisor] = useState(false);
  const [selectedFilterDepartment, setSelectedFilterDepartment] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [projectsByDepartments, setProjectsByDepartments] = useState({});
  const [pageNumber, setPageNumber] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(3);
  const [pageCount,setPageCount]=useState(3)
  const [isEmpty,setIsEmpty]=useState(false)
  const [studentsRequests,setStudentsRequests]=useState({})
  const [isApplied,setIsApplied]=useState(false)
  const [projectApplied,setProjectApplied]=useState()
  const {render,setRender}=useContext(RenderContext)
  const fetchData = async () => {
    try {
      const response = await api.get('/sugg-projects/');
      const jsonData = response.data;
      const rawData = response.data;
      const dataArray = Object.keys(rawData).map(key => ({
        id: key,
        ...rawData[key],
      }));
      setData(dataArray);
      if(dataArray.length===0){
        setIsEmpty(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  

  useEffect(() => {
    fetchData();
  }, []);
  
  const maxRuns=1; 
  const [runCount, setRunCount] = useState(0);

  useEffect(()=>{
    setRunCount(0);
  },[render])

  useEffect(() => {
    console.log(runCount,'llll',render)

    const fetchRequestsData = async () => {
      try {
        const response = await api.get('/check-projects/');
      
        setIsApplied(response.data.applied)
        // Update the run count
        setRunCount((prevCount) => prevCount + 1);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Run the effect only if the run count is less than the maximum runs
    if (runCount < maxRuns) {
      fetchRequestsData();
      console.log(projectApplied)
    }
  
  
  }, [runCount]); // Include dependencies as needed
  
  useEffect(() => {
    const groupedProjects = {};
    const groupedProjectsByDepartments = {};
    const supervisorList = [];
    const departmentList = [];

    data.forEach((project) => {
      const supervisorId = project.supervisor_id;
      if (!groupedProjects[supervisorId]) {
        groupedProjects[supervisorId] = [];
        supervisorList.push({ name: project.supervisor_name, id: project.supervisor_id });
      }
      const department = project.department;
      if (!groupedProjectsByDepartments[department]) {
        groupedProjectsByDepartments[department] = [];
        departmentList.push({ name: project.department });
      }
      groupedProjectsByDepartments[department].push(project);
      groupedProjects[supervisorId].push(project);
    });
    setProjectsBySupervisor(groupedProjects);
    setProjectsByDepartments(groupedProjectsByDepartments);
    setDepartments(departmentList);
    setSupervisors(supervisorList);
  }, [data]);

  const handleSupervisorChange = (value) => {
    setSelectedDepartment(null);
    setSelectedSupervisor(value);
  };

  const handleDepartmentChange = (value) => {
    setSelectedSupervisor(null);
    setSelectedDepartment(value);
  };

  const handleFilterDepartmentChange = () => {
    setSelectedSupervisor(null);
    setSelectedDepartment(null);
    setSelectedFilterSupervisor(false);
    setSelectedFilterDepartment(true);
  };

  const handleFilterSupervisorChange = () => {
    setSelectedSupervisor(null);
    setSelectedDepartment(null);
    setSelectedFilterSupervisor(true);
    setSelectedFilterDepartment(false);
  };

  const handleClear = () => {
    setSelectedSupervisor(null);
    setSelectedDepartment(null);
    setSelectedFilterSupervisor(false);
    setSelectedFilterDepartment(false);
  };

  
  const pagesVisited = pageNumber * projectsPerPage;
  const renderGroupedProjects = () => {
    if (selectedSupervisor) {
      const displayProjects = projectsBySupervisor[selectedSupervisor]?.slice(
        pagesVisited,
        pagesVisited + projectsPerPage
      );

      return (
        <div className='projects-list'>
          {displayProjects.map((suggProject) => (
            <Card key={suggProject.id} formData={suggProject}  isApplied={isApplied}/>
          ))}
        </div>
      );
    } else if (selectedDepartment) {
      const displayProjects = projectsByDepartments[selectedDepartment]?.slice(
        pagesVisited,
        pagesVisited + projectsPerPage
      );

      return (
        <div className='projects-list'>
          {displayProjects.map((suggProject) => (
            <Card key={suggProject.id} formData={suggProject}  isApplied={isApplied}/>
          ))}
        </div>
      );
    } else if (selectedFilterSupervisor) {
      const displayProjects = supervisors.slice(pagesVisited, pagesVisited + projectsPerPage);
      return (
        <div>
          {displayProjects.map((supervisor) => (
            <div key={supervisor.id}>
              <h2>Supervisor: {supervisor.name}</h2>
              <div className='projects-list'>
                {projectsBySupervisor[supervisor.id]?.map((suggProject) => (
                  <Card key={suggProject.id} formData={suggProject}  isApplied={isApplied}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (selectedFilterDepartment) {
      const displayProjects = departments.slice(pagesVisited, pagesVisited + projectsPerPage);
      return (
        <div>
          {displayProjects.map((department) => (
            <div key={department.name}>
              <h2>Department: {department.name}</h2>
              <div className='projects-list'>
                {projectsByDepartments[department.name]?.map((suggProject) => (
                  <Card key={suggProject.id} formData={suggProject}  isApplied={isApplied}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      const displayProjects = data.slice(pagesVisited, pagesVisited + projectsPerPage);

      return (
        <div>
          <div className='projects-list'>
            {displayProjects.map((suggProject) => (
              <Card key={suggProject.id} formData={suggProject}  isApplied={isApplied}/>
            ))}
          </div>
        </div>
      );
    }
  };
  useEffect(() => {
    if (selectedFilterSupervisor ){
      setProjectsPerPage(1);
      setPageCount(Math.ceil(supervisors.length / projectsPerPage))
      
    }
    else if (selectedFilterDepartment) {
      // Set projectsPerPage to 1 if supervisor is selected
      setProjectsPerPage(1);
      setPageCount(Math.ceil(departments.length / projectsPerPage))
    } else {
      // Set projectsPerPage to 3 for other cases
      setProjectsPerPage(3);
      setPageCount(Math.ceil(data.length / projectsPerPage));
    }
  }, [selectedSupervisor,
    selectedDepartment,
    selectedFilterSupervisor,
    selectedFilterDepartment,
    departments,
    supervisors]);



  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className='container'>
      <h1>Suggestion Projects List:</h1>
      <NavDropdown
        title={
          <span>
            {'Filter By '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-funnel'
              viewBox='0 0 16 16'
            >
              <path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z' />
            </svg>
          </span>
        }
        id='basic-nav-dropdown'
        className='filter'
      >
        <NavDropdown.Item onClick={() => handleFilterDepartmentChange()}>Departments</NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleFilterSupervisorChange()}>Supervisors</NavDropdown.Item>
        <NavDropdown.Divider />
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
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => handleClear()}>clear filter </NavDropdown.Item>
      </NavDropdown>

        {data.length > 0 && runCount>0 ? (
          <div>
            {renderGroupedProjects()}
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={'pagination'}
              previousLinkClassName={'btn'}
              nextLinkClassName={'btn'}
              disabledClassName={''}
              activeLinkClassName={'active'}
              pageLinkClassName={'btn'}
            />
          </div>
        ) : isEmpty?<div>No suggestion Projects</div>:
        (<div className='content-container'>
          <Loading />
          </div>
        )}
      </div>
  );
};

export default SuggProjectsList;
