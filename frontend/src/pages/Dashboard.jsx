import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "../utils/api";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import JobStatusChart from "../components/dashboard/JobStatusChart";
import StockAlerts from "../components/dashboard/StockAlerts";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {
  const [allJobs, setAllJobs] = useState([]); // Store all jobs
  const [inventory, setInventory] = useState([]);
  const [timeRange, setTimeRange] = useState("all"); // 'all', 'week', 'month'

  const [stats, setStats] = useState({
    pendingJobs: 0,
    lowStockItems: 0,
    completedJobs: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [jobStats, setJobStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, inventoryRes] = await Promise.all([
          apiRequest("/jobs"),
          apiRequest("/inventory"),
        ]);

        if (jobsRes.ok && inventoryRes.ok) {
          const jobsData = await jobsRes.json();
          const inventoryData = await inventoryRes.json();

          setAllJobs(jobsData);
          setInventory(inventoryData);

          // Inventory stats (independent of time range)
          const lowStockItems = inventoryData.filter(
            (item) => item.stock <= item.minStock
          );
          setLowStockList(lowStockItems.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter jobs and recalculate stats when allJobs or timeRange changes
  useEffect(() => {
    if (!allJobs.length) return;

    const now = new Date();
    const filteredJobs = allJobs.filter((job) => {
      if (timeRange === "all") return true;

      const jobDate = new Date(job.date);
      // Adjust for timezone if necessary, but simple comparison usually works if both are UTC or local
      // Assuming job.date is ISO string

      if (timeRange === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return jobDate >= oneWeekAgo;
      }

      if (timeRange === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return jobDate >= oneMonthAgo;
      }

      return true;
    });

    // Calculate Job Stats
    const pending = filteredJobs.filter((job) => job.statusId === 1).length;
    const inProgress = filteredJobs.filter((job) => job.statusId === 2).length;
    const completed = filteredJobs.filter((job) => job.statusId === 3).length;
    const cancelled = filteredJobs.filter((job) => job.statusId === 4).length;
    const totalJobs = filteredJobs.length;

    setJobStats({
      pending,
      inProgress,
      completed,
      cancelled,
      total: totalJobs,
    });

    // Update Main Stats
    const lowStockCount = inventory.filter(
      (item) => item.stock <= item.minStock
    ).length;

    setStats({
      pendingJobs: pending,
      lowStockItems: lowStockCount,
      completedJobs: completed,
    });

    // Recent Jobs (always show top 5 regardless of filter, or should it respect filter?
    // Usually "Recent Activity" implies global recent, but let's respect the filter for consistency)
    const sortedJobs = filteredJobs
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentJobs(sortedJobs);
  }, [allJobs, inventory, timeRange]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar de Utilidades */}
      <DashboardSidebar />

      {/* Contenido Principal */}
      <div className="flex-1">
        <QuickActions />

        <StatsCards
          stats={stats}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockAlerts lowStockList={lowStockList} />
          <JobStatusChart stats={jobStats} />
        </div>

        <RecentActivity recentJobs={recentJobs} />
      </div>
    </div>
  );
};

export default Dashboard;
