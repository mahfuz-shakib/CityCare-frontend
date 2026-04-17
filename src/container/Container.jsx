import React from 'react';

const Container = ({children ,className}) => {
   return <div className={`container mx-auto max-w-7xl px-3 ${className}`}>{children}</div>;

};

export default Container;