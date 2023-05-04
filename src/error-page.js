import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h2>{error.status}</h2>
      <h1>Oops! {error.statusText}</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}