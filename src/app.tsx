import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  redirect,
} from "react-router-dom";

import { Search } from "./components/search";
import { RepoCommitList } from "./components/repoCommitList";

import { getCommitHistory } from "./api/github";
import "./app.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootRoute />} errorElement={<GenericErrorView />}>
      <Route path="" element={<Search />} />
      <Route
        path=":user/:repo"
        element={<RepoCommitList />}
        loader={async ({ request, params }) => {
          const { user, repo } = params;
          const signal: AbortSignal = request.signal;
          let result;
          try {
            result = await getCommitHistory(user!, repo!, {
              signal,
            });
          } catch (e: any) {
            if (e.status === 404) return redirect("/does/not/exist");
          }

          return result;
        }}
      />
      <Route path="does/not/exist" element={<NoRepoFound />} />
      <Route path="*" element={<NoRepoFound />} />
    </Route>
  )
);


// Shared component that will appear on all pages
function RootRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  const isNotRoot = location.pathname !== "/";
  // shared content that will appear on all routes
  return (
    <div>
      {/* Show 'back to search' button if not on root route */}
      {isNotRoot && (
        <button style={{ marginBottom: 25 }} onClick={() => navigate("/")}>
          Back to Search
        </button>
      )}

      {/* Nested route components appear here (similar to props.children)*/}
      <Outlet />
    </div>
  );
}

function NoRepoFound() {
  return <h2>404: This repo does NOT exist</h2>;
}

function GenericErrorView() {
  return <p>Generic Error. Please try again later.</p>;
}


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
