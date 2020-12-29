import React from 'react';
import ReactDOM from 'react-dom';
import ViewContainer from './views/ViewContainer';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import SelectRoomView from './views/SelectRoomView';
import NotFound from './views/NotFound';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<SelectRoomView />} />
          <Route path="room/:roomId" element={<ViewContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
