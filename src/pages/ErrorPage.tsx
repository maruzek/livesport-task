import { Link } from "react-router";
import BasicLayout from "../layouts/BasicLayout";
import { useEffect } from "react";

const ErrorPage = () => {
  useEffect(() => {
    document.title = "404 - Not Found | FlashResults";
  }, []);

  return (
    <BasicLayout>
      <section className="mt-4 text-center">
        <h2 className="tektur text-4xl font-medium text-white">
          404 - Not Found
        </h2>
        <p className="px-4 pt-3 text-lg font-bold">This page doesn't exist</p>
        <div className="mt-5">
          <Link
            to="/"
            className="rounded-md bg-red-700 px-4 py-2 transition-colors duration-100 hover:bg-red-800"
          >
            Go back to the search
          </Link>
        </div>
      </section>
    </BasicLayout>
  );
};

export default ErrorPage;
