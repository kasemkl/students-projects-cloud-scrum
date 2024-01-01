import React, { useContext } from 'react';
import UserInfoContext from '../context/UserInfoContext';
import Loading from '../componets/Loading';
import { formatDistanceToNow, parse, format } from 'date-fns';
import useAxios from '../utils/useAxios';

const Notifications = () => {
  const { notifications, isEmpty ,setNotifications} = useContext(UserInfoContext);
  const api=useAxios()
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
const handleClear= async()=>{
  setNotifications([])
try{
  let res= await api.delete('/notifications/')
  console.log(res.data)
}
catch(error){
  console.log('error during fetch',error)
}
}
  return (
    <div className="container">
      <h1>Notifications:</h1>

      <div className="notifications">
        {notifications.length > 0 && (
          <button onClick={handleClear} className="clear-notfications">
            <span className='delete-icon'>
              <i className="bx bx-x"></i>
            </span>
            Clear Notifications
          </button>
        )}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="card" key={notification.id}>
              <div className="card-body">
                <h3 className="card-title">{notification.message}</h3>
                <div className="card-content">
                  <p className="card-text">
                    {formatDate(
                      parse(notification.date, "yyyy/MM/dd hh:mma", new Date())
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : isEmpty ? (
          <p>No Notifications</p>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Notifications;
