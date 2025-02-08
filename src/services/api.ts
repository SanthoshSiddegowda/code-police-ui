interface Review {
  id: number;
  pr_id: number;
  repo_slug: string;
  score: number;
  created_at: string;
}

interface UserStats {
  total_reviews: number;
  average_score: number;
  reviews: Review[];
}

export interface User {
  username: string;
  display_name: string;
  email: string;
  avatar_url: string;
  type: string;
  created_at: string;
  stats: UserStats;
}

interface TopPerformer {
  name: string;
  score: number;
}

export interface WeeklyStats {
  summary: {
    total_reviews: number;
    team_average_score: number;
    total_quality_issues: number;
    total_critical_issues: number;
    most_common_issues: {
      issue: string;
      percentage: number;
    }[];
  };
  top_performers: {
    name: string;
    strength: string;
    average_score: number | null;
    total_reviews: number;
    suggested_resources: string[];
    total_quality_issues: number;
    areas_for_improvement: string;
    total_critical_issues: number;
    total_positive_aspects: number;
    learning_reference_links: string[];
  }[];
  developers_rankings: {
    name: string;
    strength: string;
    average_score: number | null;
    total_reviews: number;
    suggested_resources: string[];
    total_quality_issues: number;
    areas_for_improvement: string;
    total_critical_issues: number;
    total_positive_aspects: number;
    learning_reference_links: string[];
  }[];
}

const API_BASE_URL = 'http://localhost:8000';

export async function getUsers(): Promise<User[]> {
  try {
    if (!navigator.onLine) {
      throw new Error('No internet connection');
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 404) {
        throw new Error('API endpoint not found');
      }
      if (response.status === 403) {
        throw new Error('Access forbidden');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Data:', data);
    return data;
  } catch (error) {
    console.error('Full API Error:', error);
    throw error;
  }
}

export async function getCurrentWeekStats(): Promise<WeeklyStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/scorecard/latest`);
    if (!response.ok) {
      throw new Error('Failed to fetch weekly stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    throw error;
  }
} 