import { useState } from "react";
import { api } from "../api";

export function useMCQ() {
  const [loading, setLoading] = useState(false);

  const generate = async (editorialId) => {
    setLoading(true);
    try {
      const data = await api.editorialMCQs.generate(editorialId);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const checkAttempt = async (editorialId) => {
    try {
      return await api.editorialMCQs.checkAttempt(editorialId);
    } catch (err) {
      console.error(err);
      return { attempted: false };
    }
  };

  return { generate, checkAttempt, loading };
}
