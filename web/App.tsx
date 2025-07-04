import { LocationProvider, ErrorBoundary, Router, Route } from "preact-iso";

import { Home } from "./routes/Home";
import { Timer } from "./routes/Timer";
import { NotFound } from "./routes/404";

export const App = ({ database }: { database: IDBDatabase }) => (
  <LocationProvider>
    <ErrorBoundary>
      <Router>
        <Route path="/" component={Home} database={database} />
        <Route path="/timer" component={Timer} database={database} />
        <NotFound default />
      </Router>
    </ErrorBoundary>
  </LocationProvider>
);
