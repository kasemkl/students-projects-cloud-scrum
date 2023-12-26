// RenderContext.js
import React, { createContext, useEffect, useState } from 'react';

const RenderContext = createContext();

export default RenderContext;

export const RenderProvider = ({ children }) => {
  const [render, setRender] = useState(true);
  const data = {
    render: render,
    setRender: setRender,

  };

  
  return (
    <RenderContext.Provider value={data}>
      {children}
    </RenderContext.Provider>
  );
};
