import React from 'react'
import Spinner from 'react-bootstrap/Spinner';
import '../styles/loading.css'
const Loading = () => {
  return (
    <div className='loading'>
        <Spinner animation="border" variant="secondary" size='xl' className='mr-2 spinner' />
    </div>
  )
}

export default Loading
