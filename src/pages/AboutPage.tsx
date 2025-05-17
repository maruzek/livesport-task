import { Link } from "react-router";
import BasicLayout from "../layouts/BasicLayout";

const AboutPage = () => {
  return (
    <BasicLayout>
      <section className="p-4 text-center">
        <h2 className="tektur my-4 text-3xl font-bold">About the app</h2>
        <p>
          This app was created by{" "}
          <a href="https://www.martinruzek.cz" target="_blank">
            Martin Růžek
          </a>{" "}
          as a part of the Livesport Summer Internship recruitment process in
          2025
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-md bg-red-700 px-4 py-2 transition-colors duration-100 hover:bg-red-800"
        >
          Back to the search page
        </Link>
      </section>
    </BasicLayout>
  );
};

export default AboutPage;
