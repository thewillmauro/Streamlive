import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";

// ─── useProfile ──────────────────────────────────────────────────────────────
export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (err) setError(err);
    else setProfile(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateProfile = useCallback(async (updates) => {
    if (!userId) return;
    // Optimistic
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
    const { error: err } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);
    if (err) {
      setError(err);
      fetch(); // rollback
    }
  }, [userId, fetch]);

  return { profile, loading, error, refetch: fetch, updateProfile };
}

// ─── useBuyers ───────────────────────────────────────────────────────────────
export function useBuyers(profileId) {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from("buyers")
      .select("*")
      .eq("profile_id", profileId)
      .order("spend", { ascending: false });
    if (err) setError(err);
    else setBuyers(data || []);
    setLoading(false);
  }, [profileId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createBuyer = useCallback(async (buyer) => {
    const row = { ...buyer, profile_id: profileId };
    // Optimistic: add with temp id
    const tempId = "temp-" + Date.now();
    setBuyers((prev) => [{ ...row, id: tempId }, ...prev]);
    const { data, error: err } = await supabase
      .from("buyers")
      .insert(row)
      .select()
      .single();
    if (err) {
      setError(err);
      setBuyers((prev) => prev.filter((b) => b.id !== tempId));
      return null;
    }
    setBuyers((prev) => prev.map((b) => (b.id === tempId ? data : b)));
    return data;
  }, [profileId]);

  const updateBuyer = useCallback(async (id, updates) => {
    setBuyers((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    const { error: err } = await supabase
      .from("buyers")
      .update(updates)
      .eq("id", id);
    if (err) {
      setError(err);
      fetch();
    }
  }, [fetch]);

  const deleteBuyer = useCallback(async (id) => {
    const prev = buyers;
    setBuyers((b) => b.filter((x) => x.id !== id));
    const { error: err } = await supabase
      .from("buyers")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err);
      setBuyers(prev);
    }
  }, [buyers, fetch]);

  return { buyers, loading, error, refetch: fetch, createBuyer, updateBuyer, deleteBuyer };
}

// ─── useProducts ─────────────────────────────────────────────────────────────
export function useProducts(profileId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from("products")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });
    if (err) setError(err);
    else setProducts(data || []);
    setLoading(false);
  }, [profileId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createProduct = useCallback(async (product) => {
    const row = { ...product, profile_id: profileId };
    const tempId = "temp-" + Date.now();
    setProducts((prev) => [{ ...row, id: tempId }, ...prev]);
    const { data, error: err } = await supabase
      .from("products")
      .insert(row)
      .select()
      .single();
    if (err) {
      setError(err);
      setProducts((prev) => prev.filter((p) => p.id !== tempId));
      return null;
    }
    setProducts((prev) => prev.map((p) => (p.id === tempId ? data : p)));
    return data;
  }, [profileId]);

  const updateProduct = useCallback(async (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const { error: err } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);
    if (err) {
      setError(err);
      fetch();
    }
  }, [fetch]);

  const deleteProduct = useCallback(async (id) => {
    const prev = products;
    setProducts((p) => p.filter((x) => x.id !== id));
    const { error: err } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err);
      setProducts(prev);
    }
  }, [products, fetch]);

  return { products, loading, error, refetch: fetch, createProduct, updateProduct, deleteProduct };
}
