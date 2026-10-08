import { useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();

  return (
    <div className="page not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      {error && <p>Error: {String(error)}</p>}
    </div>
  );
}
