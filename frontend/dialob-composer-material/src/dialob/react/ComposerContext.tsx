import React, { useReducer, Dispatch } from 'react';
import { formReducer } from '../reducer';
import { ComposerAction } from '../actions';
import { ComposerState, ComposerCallbacks } from '../types';

const INITIAL_FORM: ComposerState = {
  _id: '',
  _rev: '',
  name: '',
  data: {},
  metadata: {},
};

export const ComposerContext = React.createContext<{state: ComposerState, dispatch: Dispatch<ComposerAction>, callbacks?: ComposerCallbacks}>({
  state: INITIAL_FORM,
  dispatch: () => null,
  callbacks: {}
});

export interface ComposerProviderProps {
  children: React.ReactNode;
  formData: ComposerState;
  callbacks ?: ComposerCallbacks;
}

export const ComposerProvider: React.FC<ComposerProviderProps> = ({children, formData, callbacks}) => {
  const [state, dispatch] = useReducer(formReducer, formData);

  return (
    <ComposerContext.Provider value={{state, dispatch, callbacks}}>
      {children}
    </ComposerContext.Provider>
  );

}