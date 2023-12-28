import React, { useContext } from 'react';
import UserInfoContext from '../context/UserInfoContext';
import Loading from '../componets/Loading';
import { formatDistanceToNow, parse, format } from 'date-fns';

const Notifications = () => {
  const { notifications, isEmpty } = useContext(UserInfoContext);

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className='container'>
      <h1>Notifications:</h1>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div className='card' key={notification.id}>
            <div className='card-body'>
              <h3 className='card-title'>{notification.message}</h3>
              <div className='card-content'>
                <p className='card-text'>{formatDate(parse(notification.date, 'yyyy/MM/dd hh:mma', new Date()))}</p>
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
  );
};

export default Notifications;
