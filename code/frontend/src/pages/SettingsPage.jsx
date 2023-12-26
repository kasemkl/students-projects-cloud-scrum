import React from 'react';
import '../styles/settings.css'
import Settings from '../componets/Settings';
const SettingsPage = () => {
    const list=['Profile']
  return (
    <Settings data={list}/>
  );
};

export default SettingsPage;
