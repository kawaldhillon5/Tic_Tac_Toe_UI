import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './css/index.css'

import Root from './routes/root';
import Game from './routes/game';
import ErrorPage from './routes/error-page';
import Home from './routes/home';
import { GameProvider } from './hooks/useGame';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameProvider><Root/></GameProvider>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "game/:gameId", 
        element: <Game />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);