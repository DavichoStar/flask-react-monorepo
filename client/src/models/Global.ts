export interface ErrorResponse {
  status: number;
  message: string;
}

export interface AlertContent {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}
