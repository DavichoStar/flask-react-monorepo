import axios from "axios";

import { NewProduct, Product } from "../models/Product";
import { API_URL } from "../helpers";
import { ErrorResponse } from "../models/Global";
import { checkToken } from "./LoginService";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axios
    .get<Product[]>(`${API_URL}/products`)
    .catch((err) => {
      return {
        status: err.response.status,
        data: [],
      };
    });

  return response.data;
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  const response = await axios
    .get<Product>(`${API_URL}/products/${id}`)
    .catch((err) => {
      return {
        status: err.response.status,
        data: undefined,
      };
    });

  return response.data;
};

export const createProduct = async (
  body: NewProduct
): Promise<Product | ErrorResponse> => {
  const isValid = checkToken();
  if (!isValid) return { status: 401, message: "Token expired" };

  const response = await axios
    .post<Product>(`${API_URL}/products`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .catch((err) => {
      return {
        status: err.response.status,
        data: err.response.data as ErrorResponse,
      };
    });

  return response.data;
};

export const updateProduct = async (
  body: Product
): Promise<Product | ErrorResponse> => {
  const isValid = checkToken();
  if (!isValid) return { status: 401, message: "Token expired" };

  const response = await axios
    .put<Product>(`${API_URL}/products/${body.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .catch((err) => {
      return {
        status: err.response.status,
        data: err.response.data as ErrorResponse,
      };
    });

  return response.data;
};

export const deleteProduct = async (id: string): Promise<ErrorResponse> => {
  const isValid = checkToken();
  if (!isValid) return { status: 401, message: "Token expired" };

  const response = await axios
    .delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .catch((err) => {
      return {
        status: err.response.status,
        data: err.response.data as ErrorResponse,
      };
    });

  return response.data;
};
