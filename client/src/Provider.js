import React, { createContext, useState } from 'react';

export const Data = createContext();

const Provider = ({ children }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Data.Provider value={{show,setShow}}>
        {children}
      </Data.Provider>
    </div>
  );
};

export default Provider;
