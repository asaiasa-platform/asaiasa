import { env } from '@/config/env';

// API Response types following the user rules
export interface ApiListResponse<T> {
  code: number;
  data: T[];
  page: number;
  page_size: number;
  total_page: number;
  total_data: number;
  message: string;
  data_schema: any;
}

export interface ApiSingleResponse<T> {
  code: number;
  data: T;
  message: string;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = env.API_BASE_URL;
    this.timeout = env.API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // Include cookies for session management
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // GET request with pagination support
  async get<T>(
    endpoint: string,
    params: {
      _page?: number;
      _pageSize?: number;
      [key: string]: any;
    } = {}
  ): Promise<ApiListResponse<T>> {
    const searchParams = new URLSearchParams();
    
    // Add default pagination params
    searchParams.append('_page', String(params._page || 1));
    searchParams.append('_pageSize', String(params._pageSize || 10));
    
    // Add other params
    Object.entries(params).forEach(([key, value]) => {
      if (key !== '_page' && key !== '_pageSize' && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    const response = await this.request<any>(url);
    
    // Handle different response formats
    if (Array.isArray(response)) {
      // Direct array response (like from some endpoints)
      return {
        code: 0,
        data: response,
        page: params._page || 1,
        page_size: params._pageSize || 10,
        total_page: 1,
        total_data: response.length,
        message: '',
        data_schema: null
      };
    } else if (response && typeof response === 'object') {
      // Check if it's already in the expected format
      if ('data' in response) {
        return response;
      } else {
        // Wrap single object in array
        return {
          code: 0,
          data: [response],
          page: params._page || 1,
          page_size: params._pageSize || 10,
          total_page: 1,
          total_data: 1,
          message: '',
          data_schema: null
        };
      }
    }
    
    return response;
  }

  // GET single item
  async getOne<T>(endpoint: string): Promise<ApiSingleResponse<T>> {
    const response = await this.request<any>(endpoint);
    
    // Handle direct response (not wrapped in ApiSingleResponse format)
    if (response && typeof response === 'object' && !('data' in response)) {
      // Direct object response, wrap it in the expected format
      return {
        code: 0,
        data: response,
        message: '',
        data_schema: null
      };
    }
    
    // Already in the expected format or handle other cases
    return response;
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiSingleResponse<T>> {
    return this.request<ApiSingleResponse<T>>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiSingleResponse<T>> {
    return this.request<ApiSingleResponse<T>>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiSingleResponse<T>> {
    return this.request<ApiSingleResponse<T>>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Contact Channel interface for event details
export interface ContactChannel {
  media: string;
  mediaLink: string;
}

// Organization interface for events
export interface EventOrganization {
  id: number;
  name: string;
  email: string;
  phone: string;
  picUrl: string;
  bgUrl: string;
  headline: string;
  specialty: string;
  description: string;
  address: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  organizationContacts: any;
  industries: any;
  updatedAt: string;
}

// Data types based on actual backend API response
export interface Event {
  id: number;
  organization_id?: number;
  name: string;
  picUrl: string;
  content?: string; // HTML content for event description
  latitude: number;
  longitude: number;
  startDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  locationName: string;
  province: string;
  country: string;
  locationType: string;
  organization: EventOrganization;
  categories: Array<{
    value: number;
    label: string;
  }>;
  audience: string;
  price?: string; // For list view
  priceType?: string; // For detail view
  registerLink?: string;
  status?: string;
  contactChannels?: ContactChannel[];
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  organization_id: string;
  organization?: Organization;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  location: string;
  requirements?: string[];
  benefits?: string[];
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  email: string;
  phone: string;
  picUrl: string;
  bgUrl: string;
  headline: string;
  specialty: string;
  description: string;
  address: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  organizationContacts: any;
  industries: any;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

// Specific API endpoints matching backend routes
export const api = {
  // Events - matching backend routes
  events: {
    getAll: (params?: { _page?: number; _pageSize?: number; category?: string }) =>
      apiClient.get<Event>('/events-paginate', params),
    getById: (id: string) =>
      apiClient.getOne<Event>(`/events/${id}`),
    search: (params?: { _page?: number; _pageSize?: number; query?: string; category?: string }) =>
      apiClient.get<Event>('/events-paginate/search', params),
    getByOrgId: (orgId: string, params?: { _page?: number; _pageSize?: number }) =>
      apiClient.get<Event>(`/orgs/${orgId}/events`, params),
    getCategories: () =>
      apiClient.get<{ label: string; value: string }>('/events/categories/list'),
  },

  // Jobs - matching backend routes
  jobs: {
    getAll: (params?: { _page?: number; _pageSize?: number; category?: string }) =>
      apiClient.get<Job>('/orgs/jobs/jobs-paginate', params),
    getById: (id: string) =>
      apiClient.getOne<Job>(`/jobs/get/${id}`),
    search: (params?: { _page?: number; _pageSize?: number; query?: string }) =>
      apiClient.get<Job>('/jobs-paginate/search', params),
    getByOrgId: (orgId: string, params?: { _page?: number; _pageSize?: number }) =>
      apiClient.get<Job>(`/orgs/${orgId}/jobs/list`, params),
    getPrerequisites: (jobId: string) =>
      apiClient.get<any>(`/jobs/${jobId}/prerequisites`),
  },

  // Organizations - matching backend routes
  organizations: {
    getAll: (params?: { _page?: number; _pageSize?: number; industry?: string }) =>
      apiClient.get<Organization>('/orgs-paginate', params),
    getById: (id: string) =>
      apiClient.getOne<Organization>(`/orgs/get/${id}`),
    getList: () =>
      apiClient.get<Organization>('/orgs/list'),
    getIndustries: () =>
      apiClient.get<{ label: string; value: string }>('/orgs/industries/list'),
    getContacts: (orgId: string) =>
      apiClient.get<any>(`/orgs/${orgId}/contacts/list`),
  },

  // Authentication - matching backend routes
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post<{ token: string; user: User }>('/login', credentials),
    signup: (userData: { name: string; email: string; password: string; phone?: string }) =>
      apiClient.post<{ token: string; user: User }>('/signup', userData),
    logout: () =>
      apiClient.post<{ message: string }>('/logout'),
    me: () =>
      apiClient.getOne<User>('/auth/me'),
    googleCallback: (code: string) =>
      apiClient.getOne<{ token: string; user: User }>(`/auth/google/callback?code=${code}`),
    adminLogin: (credentials: { email: string; password: string }) =>
      apiClient.post<{ token: string; user: User }>('/admin/login', credentials),
    tokenCheck: () =>
      apiClient.getOne<{ valid: boolean }>('/token-check'),
  },

  // Recommendations - matching backend routes
  recommendations: {
    getEvents: () =>
      apiClient.get<Event>('/recommendation'),
  },

  // Location/Map
  location: {
    getProvinces: () =>
      apiClient.get<any>('/provinces'),
  },
};
