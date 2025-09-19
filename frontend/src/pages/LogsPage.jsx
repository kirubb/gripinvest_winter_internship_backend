import React, { useState, useEffect } from "react";
import apiClient from "../api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom"; // Add this import

function LogsPage({ onLogout }) {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [errorSummary, setErrorSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");

  const fetchMyLogs = async () => {
    setLoading(true);
    setIsSearching(false);
    setSearchTitle("");
    try {
      const [logsResponse, summaryResponse, errorSummaryResponse] =
        await Promise.all([
          apiClient.get("/logs"),
          apiClient.get("/logs/summary"),
          apiClient.get("/logs/error-summary"),
        ]);
      setLogs(logsResponse.data);
      setSummary(summaryResponse.data);
      setErrorSummary(errorSummaryResponse.data);
    } catch (err) {
      console.error("Failed to fetch log data", err);
      setError("Could not load activity data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVerified) {
      fetchMyLogs();
    }
  }, [isVerified]);

  const handleVerification = (e) => {
    e.preventDefault();
    if (passwordInput === "password") {
      setIsVerified(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    setLoading(true);
    setIsSearching(true);
    setSearchTitle(`Search Results for: ${searchEmail}`);
    try {
      const response = await apiClient.post("/logs/search", {
        email: searchEmail,
      });
      setLogs(response.data);
    } catch (err) {
      console.error("Failed to search logs", err);
      alert("Could not find logs for that email.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-center mb-4">
            Admin Verification
          </h2>
          <p className="text-center text-gray-300 mb-6">
            You sure you're an admin right? Please enter password to enter
            pookie (❁´◡`❁)
          </p>
          <p className="text-center text-gray-300 mb-6">Neeche toh dekho</p>
          <form onSubmit={handleVerification}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter password"
            />
            <button
              type="submit"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Enter
            </button>
            <div className="text-center mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg ">
            <Link to="/" className="text-sm text-white hover:underline">
              Back to Dashboard
            </Link>
          </div>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <p className="text-center text-red-500 font-bold text-sm mt-6">
            The password is password
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar onLogout={onLogout} />
        <h1 className="text-3xl font-bold mb-6">
          {isSearching ? searchTitle : "Your Activity Logs"}
        </h1>

        <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search logs by user email..."
              className="flex-grow px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Search
            </button>
            {isSearching && (
              <button
                type="button"
                onClick={fetchMyLogs}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Clear Search
              </button>
            )}
          </form>
        </div>

        {!isSearching && summary && (
          <div className="bg-indigo-900/50 border border-indigo-700 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-indigo-300">
              AI Activity Summary (My Logs)
            </h2>
            <p className="text-gray-300 mt-2">{summary.summary}</p>
          </div>
        )}

        {!isSearching && errorSummary && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-red-300">
              AI Error Analysis (My Logs)
            </h2>
            <p className="text-gray-300 mt-2">{errorSummary.summary}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Endpoint
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Method
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-600/20"
                  >
                    <td className="py-3 px-4">{log.endpoint}</td>
                    <td className="py-3 px-4">{log.http_method}</td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          log.status_code >= 400
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        {log.status_code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LogsPage;
