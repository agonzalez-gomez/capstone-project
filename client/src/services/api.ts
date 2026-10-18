import { getGridUtilityClass, paperClasses } from "@mui/material";
import type { ArticleList } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const getAuthHeaders = () => {
  const token = window.localStorage.getItem("troubleshootToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  });
  if (!response.ok) throw new Error("Failed to login");

  const data = (await response.json()) as unknown as {
    token: string;
    message: string;
  };

  if (data?.token) {
    window.localStorage.setItem("troubleshootToken", data.token);
    return true;
  }

  return false;
}

async function register(email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  });

  if (!response.ok) {
    const data = (await response.json()) as unknown as {
      message: string;
    };

    return data.message;
  }
  return true;
}

export async function verifyAuth() {
  try {
    console.log({
      url: `${API_URL}/verify`,
      headers: {
        ...getAuthHeaders(),
      },
    });
    const response = await fetch(`${API_URL}/verify`, {
      ...getAuthHeaders(),
    });

    console.log(response);
    if (!response.ok) return false;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function listArticles() {
  const response = await fetch(`${API_URL}/articles`, {
    ...getAuthHeaders(),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as unknown as ArticleList;

  return data;
}

// export async function fetchRecords() {
//   const response = await fetch(`${API_URL}/record`);
//   if (!response.ok) throw new Error("Failed to fetch records");
//   return response.json();
// }

// export async function fetchRecordById(id: string) {
//   const response = await fetch(`${API_URL}/record/${id}`);
//   if (!response.ok) throw new Error("Failed to fetch record");
//   return response.json();
// }

// export async function createRecord(data: {
//   name: string;
//   position: string;
//   level: string;
// }) {
//   const response = await fetch(`${API_URL}/record`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error("Failed to create record");
//   return response.json();
// }

// export async function updateRecord(
//   id: string,
//   data: { name: string; position: string; level: string },
// ) {
//   const response = await fetch(`${API_URL}/record/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error("Failed to update record");
//   return response.json();
// }

// export async function deleteRecord(id: string) {
//   const response = await fetch(`${API_URL}/record/${id}`, {
//     method: "DELETE",
//   });
//   if (!response.ok) throw new Error("Failed to delete record");
//   return response.json();
// }

const API = {
  login,
  verifyAuth,
  register,
  listArticles,
};

export default API;
