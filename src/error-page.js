import { useRouteError } from "react-router-dom";

export default function ErrorPage({ err }) {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <div>
        <h2>{error.status || err.status }</h2>
        <h1>Oops! {error.statusText || err.text}</h1>
        <p>Sorry, an unexpected error has occurred.</p>
      </div>
    </div>
  );
}