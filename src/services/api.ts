import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_ENDPOINTS, APP_CONSTANTS } from "../constants";
import { LoginRequest, LoginResponse, UsersResponse } from "../types";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(
      APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  getProfile: async (): Promise<LoginResponse> => {
    const response = await api.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },
};

export const usersAPI = {
  getUsers: async (
    skip: number = 0,
    limit: number = APP_CONSTANTS.PAGINATION_LIMIT
  ): Promise<UsersResponse> => {
    const response = await api.get(
      `${API_ENDPOINTS.USERS}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  searchUsers: async (
    query: string,
    skip: number = 0,
    limit: number = APP_CONSTANTS.PAGINATION_LIMIT
  ): Promise<UsersResponse> => {
    const response = await api.get(
      `${API_ENDPOINTS.USERS}/search?q=${encodeURIComponent(
        query
      )}&skip=${skip}&limit=${limit}`
    );
    return response.data;
  },
};

export default api;
