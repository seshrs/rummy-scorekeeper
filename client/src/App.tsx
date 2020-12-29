import React from 'react';
import ViewContainer from './views/ViewContainer';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SelectRoomView from './views/SelectRoomView';
import NotFound from './views/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<SelectRoomView />} />
          <Route path="room/:roomId" element={<ViewContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}
