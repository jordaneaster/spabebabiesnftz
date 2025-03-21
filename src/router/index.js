// This file contains route configurations but doesn't create a router instance
// to avoid conflicts with the BrowserRouter in App.js

const routes = [
  {
    path: '/',
    component: 'HomePage',
  },
  {
    path: '/etherland',
    component: 'Etherland',
  },
];

export default routes;