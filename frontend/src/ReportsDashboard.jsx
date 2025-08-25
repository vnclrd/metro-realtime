// ReportsDashboard.js - Component to view all reports
import React, { useState, useEffect } from 'react';

const ReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? 'http://localhost:5000/api/reports'
        : `http://localhost:5000/api/reports?status=${statusFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the report in local state
        setReports(prevReports =>
          prevReports.map(report =>
            report.id === reportId
              ? { ...report, status: newStatus }
              : report
          )
        );
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setReports(prevReports =>
          prevReports.filter(report => report.id !== reportId)
        );
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Reports Dashboard</h1>
        
        {/* Filter */}
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reports found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image */}
              {report.image_filename && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={`http://localhost:5000/api/images/${report.image_filename}`}
                    alt="Report"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Status and Date */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(report.timestamp)}
                  </span>
                </div>

                {/* Issue Type */}
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {report.issue_type === 'custom' ? 'Custom Issue' : report.issue_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  {report.custom_issue && (
                    <p className="text-gray-600 text-sm mt-1">{report.custom_issue}</p>
                  )}
                </div>

                {/* Location */}
                {report.location && (
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Location:</strong> {report.location}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {report.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={report.status}
                    onChange={(e) => updateReportStatus(report.id, e.target.value)}
                    className="text-sm px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;