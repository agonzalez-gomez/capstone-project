import type {
  ArticleDetail,
  ArticleList,
  ArticleStats,
  SessionUpdate,
  Ticket,
} from "../types";

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

function logout() {
  window.localStorage.removeItem("troubleshootToken");
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

async function getArticle(slug: string) {
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    ...getAuthHeaders(),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as unknown as ArticleDetail;

  return data;
}

async function createTicket(
  sessionId: string,
  page: number,
  description: string,
) {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    ...getAuthHeaders(),
    body: JSON.stringify({ sessionId, page, description }),
  });

  return response.ok;
}

async function listTickets() {
  const response = await fetch(`${API_URL}/tickets`, {
    ...getAuthHeaders(),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as unknown as Ticket[];

  return data;
}

async function getArticleStats(slug: string) {
  const response = await fetch(`${API_URL}/articles/${slug}/stats`, {
    ...getAuthHeaders(),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as unknown as ArticleStats;

  return data;
}

async function startSession(slug: string) {
  const response = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    ...getAuthHeaders(),
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as unknown as { _id: string };

  return data._id;
}

async function updateSession(id: string, session: SessionUpdate) {
  const response = await fetch(`${API_URL}/sessions/${id}`, {
    method: "PATCH",
    ...getAuthHeaders(),
    body: JSON.stringify(session),
  });

  return response.ok;
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
  logout,
  verifyAuth,
  register,
  listArticles,
  getArticle,
  getArticleStats,
  startSession,
  updateSession,
  createTicket,
  listTickets,
};

export default API;
