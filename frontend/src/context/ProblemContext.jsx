import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  const [page, setPageState] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 9 });
  
  const [filters, setFiltersState] = useState({
    topic: '',
    difficulty: '',
    platform: '',
    starred: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  const setFilters = (newFilters) => {
    setPageState(1);
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setPageState(1);
    setFiltersState({
      topic: '',
      difficulty: '',
      platform: '',
      starred: '',
      search: '',
      startDate: '',
      endDate: '',
    });
  };

  const fetchProblems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.topic) params.topic = filters.topic;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.platform) params.platform = filters.platform;
      if (filters.starred) params.starred = filters.starred;
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await api.get('/api/problems', { params });
      setProblems(data.problems || []);
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0,
        limit: 9
      });
    } catch (error) {
      console.error('Failed to fetch problems', error);
    } finally {
      setLoading(false);
    }
  }, [user, filters, page]);

  const fetchDashboardStats = useCallback(async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      const { data } = await api.get('/api/analytics/dashboard');
      setDashboardStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setStatsLoading(false);
    }
  }, [user]);


  // Fetch problems when filters or user changes
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const addProblem = async (problemData) => {
    try {
      await api.post('/api/problems', problemData);
      setPageState(1);
      fetchProblems();
      fetchDashboardStats();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add problem.',
      };
    }
  };

  const editProblem = async (id, problemData) => {
    try {
      await api.put(`/api/problems/${id}`, problemData);
      fetchProblems();
      fetchDashboardStats();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update problem.',
      };
    }
  };

  const deleteProblem = async (id) => {
    try {
      await api.delete(`/api/problems/${id}`);
      fetchProblems();
      fetchDashboardStats();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete problem.',
      };
    }
  };

  const toggleStarProblem = async (id, currentStarred) => {
    return editProblem(id, { starred: !currentStarred });
  };

  return (
    <ProblemContext.Provider
      value={{
        problems,
        dashboardStats,
        loading,
        statsLoading,
        filters,
        setFilters,
        clearFilters,
        fetchProblems,
        fetchDashboardStats,
        addProblem,
        editProblem,
        deleteProblem,
        toggleStarProblem,
        page,
        setPageState,
        pagination,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => useContext(ProblemContext);
