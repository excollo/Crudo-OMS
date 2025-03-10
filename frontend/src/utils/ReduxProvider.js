/ src/utils/ReduxProvider.js
import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;