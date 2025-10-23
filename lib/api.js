let SecureStore;
try {
  SecureStore = require("expo-secure-store");
} catch (e) {
  // Fallback to AsyncStorage if secure store not installed (web/dev environments)
  console.warn(
    "[auth] expo-secure-store not available, falling back to AsyncStorage"
  );
  SecureStore = null;
}
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://upsc-backend-production.up.railway.app/api";

async function getToken() {
  try {
    if (SecureStore) return await SecureStore.getItemAsync("auth_token");
    return await AsyncStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const apiErr = (data && data.error) || { message: "Request failed" };
    throw apiErr;
  }
  return data;
}

export const api = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/users/me"),

  // ---------- ARTICLES ----------
  articles: (page = 1, limit = 10) =>
    request(`/articles?page=${page}&limit=${limit}`),
  searchArticles: (q) => request(`/articles/search?q=${encodeURIComponent(q)}`),
  article: (id) => request(`/articles/${id}`),
  createArticle: (body) =>
    request("/articles", { method: "POST", body: JSON.stringify(body) }),
  updateArticle: (id, body) =>
    request(`/articles/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteArticle: (id) => request(`/articles/${id}`, { method: "DELETE" }),

  // ---------- BOOKMARKS ----------
  bookmarks: () => request("/bookmarks"),
  addBookmark: (articleId) =>
    request(`/bookmarks/${articleId}`, { method: "POST" }),
  removeBookmark: (articleId) =>
    request(`/bookmarks/${articleId}`, { method: "DELETE" }),

  // ---------- MCQs ----------
  mcqsGenerate: (articleId) => request(`/mcqs/generate/${articleId}`),
  mcqSubmit: (body) =>
    request("/mcqs/submit", { method: "POST", body: JSON.stringify(body) }),
  mcqAttempt: (articleId) => request(`/mcqs/attempt/${articleId}`),

  // ---------- GEMINI ----------
  geminiGenerate: (body) =>
    request("/gemini/generate", { method: "POST", body: JSON.stringify(body) }),

  // ---------- ✨ EDITORIALS ----------
  editorials: (page = 1) => request(`/editorials?page=${page}`),
  editorial: (id) => request(`/editorials/${id}`),
  createEditorial: (body) =>
    request("/editorials", { method: "POST", body: JSON.stringify(body) }),
  deleteEditorial: (id) => request(`/editorials/${id}`, { method: "DELETE" }),
};
// ---------- 🧠 EDITORIAL MCQs ----------
api.editorialMCQs = {
  generate: (editorialId) =>
    request(`/editorial-mcqs/generate/${editorialId}`),

  get: (editorialId) => request(`/editorial-mcqs/${editorialId}`),

  submit: (body) =>
    request("/editorial-mcqs/submit", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  checkAttempt: (editorialId) =>
    request(`/editorial-mcqs/check/${editorialId}`),
};

export async function setToken(token) {
  if (SecureStore) {
    if (!token) await SecureStore.deleteItemAsync("auth_token");
    else await SecureStore.setItemAsync("auth_token", token);
    return;
  }
  if (!token) await AsyncStorage.removeItem("auth_token");
  else await AsyncStorage.setItem("auth_token", token);
}
