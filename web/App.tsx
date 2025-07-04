import { lazy, LocationProvider, ErrorBoundary, Router, Route } from "preact-iso";

import { Home } from "./routes/Home";

const { Timer } = lazy(() => import("./routes/Timer"));
const { NotFound } = lazy(() => import("./routes/404"));

export const App = () => (
  <LocationProvider>
    <ErrorBoundary>
      <Router>
        <Home path="/" />
        <Route path="/timer" component={Timer} />
        <NotFound default />
      </Router>
    </ErrorBoundary>
  </LocationProvider>
);
