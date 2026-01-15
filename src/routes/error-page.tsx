import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import "../css/error.css";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Determine the error message
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // Handle specific 404, 500, etc. responses
    errorMessage = error.statusText || error.data?.message || "Page not found";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error occurred";
  }

  return (
    <div id="error-page" className="error-container">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="error-msg">
        <i>{errorMessage}</i>
      </p>
      <button className="back-btn" onClick={() => navigate("/")}>
        Return to Home
      </button>
    </div>
  );
}