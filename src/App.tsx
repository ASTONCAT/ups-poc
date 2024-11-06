import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import "./App.css";

interface JobPosition {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  // ... other properties you need
}

const JobListPage: React.FC = () => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const response = await axios.get(
          "https://upstechnology.cz/cms/wp-json/wp/v2/jobs"
        );
        setJobPositions(response.data);
      } catch (error) {
        console.error("Error fetching job positions:", error);
      }
    };

    fetchJobPositions();
  }, []);

  return (
    <div>
      <h1>Great Jobs</h1>
      <ul>
        {jobPositions.map((job) => (
          <li key={job.id}>
            <Link to={`/job/${job.slug}`}>{job.title.rendered}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const JobPositionDetails: React.FC = () => {
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);

  // Get the job slug from the URL
  const { slug } = useParams();

  useEffect(() => {
    const fetchJobPosition = async () => {
      try {
        const response = await axios.get(
          `https://upstechnology.cz/cms/wp-json/wp/v2/jobs?slug=${slug}`
        );
        setJobPosition(response.data[0]); // Assuming slug is unique
      } catch (error) {
        console.error("Error fetching job position:", error);
      }
    };

    if (slug) {
      fetchJobPosition();
    }
  }, [slug]);

  if (!jobPosition) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{jobPosition.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: jobPosition.content.rendered }} />
      {/* ... display other details */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobListPage />} />
        <Route path="/job/:slug" element={<JobPositionDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
