import React from 'react';
import { FillError } from "@dialob/fill-api";

export interface ConfigContextType {
  errors: (items: FillError[]) => React.ReactElement;
  description: (text: string) => React.ReactElement;
}

const context = React.createContext<ConfigContextType>({ 
  errors: (items: FillError[]) => {
    console.log("errors has no impl.", items);
    return (<></>);
  },
  description: (text: string) => {
    console.log("description has no impl.", text);
    return (<></>);
  }
});
export const ConfigContext = context;