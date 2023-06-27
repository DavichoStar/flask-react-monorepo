import moment from "moment-timezone";
import axios from "axios";

import { LoginData, User } from "../models/User";
import { ErrorResponse } from "../models/Global";
import { API_URL } from "../helpers";

interface LoginResponse {
  access_token: string;
  expires_in: string;
  user: User;
}

export const login = async (body: {
  username: string;
  password: string;
}): Promise<LoginResponse | ErrorResponse> => {
  const response = await axios
    .post<LoginData>(`${API_URL}/login`, body)
    .catch((err) => {
      return {
        status: err.response?.status || 500,
        data: err.response?.data || err.message,
      };
    });

  if (response.status === 200) return response.data;
  else
    return {
      status: response.status,
      message: response.data.message,
    };
};

export const checkToken = (): boolean => {
  const expiresIn = localStorage.getItem("expires_in");
  if (!expiresIn) return false;

  const isNowExpired = moment().isAfter(moment(expiresIn));

  if (isNowExpired) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("user");
    return false;
  }

  return true;
};
