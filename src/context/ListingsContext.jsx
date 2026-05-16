import React, { createContext, useContext, useState, useEffect } from "react";
import { listingsService, accessRequestsService } from "../lib/supabaseService";
import { useAuth } from "./AuthContext";

const ListingsContext = createContext();

export function ListingsProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [listings, setListings] = useState([]);
  const [publicListings, setPublicListings] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load public listings
  useEffect(() => {
    const loadPublicListings = async () => {
      try {
        setLoading(true);
        const data = await listingsService.getPublicListings();
        setPublicListings(data);
        setListings(data);
      } catch (err) {
        console.error("Error loading listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPublicListings();
  }, []);

  // Load admin listings
  useEffect(() => {
    if (isAdmin && user) {
      const loadAdminListings = async () => {
        try {
          const data = await listingsService.getAdminListings(user.id);
          setAdminListings(data);
        } catch (err) {
          console.error("Error loading admin listings:", err);
        }
      };

      loadAdminListings();
    }
  }, [isAdmin, user]);

  // Ajouter un listing
  const addListing = async (listing) => {
    try {
      setError(null);
      const newListing = await listingsService.createListing(listing);
      if (isAdmin) {
        setAdminListings((prev) => [newListing, ...prev]);
      }
      return newListing;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Modifier un listing
  const updateListing = async (id, updatedData) => {
    try {
      setError(null);
      const updated = await listingsService.updateListing(id, updatedData);
      if (isAdmin) {
        setAdminListings((prev) =>
          prev.map((l) => (l.id === id ? updated : l))
        );
      }
      setPublicListings((prev) =>
        prev.map((l) => (l.id === id ? updated : l))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Supprimer un listing
  const deleteListing = async (id) => {
    try {
      setError(null);
      await listingsService.deleteListing(id);
      setAdminListings((prev) => prev.filter((l) => l.id !== id));
      setPublicListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Upload image
  const uploadImage = async (file, listingId) => {
    try {
      setError(null);
      const url = await listingsService.uploadImage(file, listingId);
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Upload document
  const uploadDocument = async (file, listingId, documentName) => {
    try {
      setError(null);
      const url = await listingsService.uploadDocument(file, listingId, documentName);
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Demander accès Off Market
  const submitAccessRequest = async (listingId, message = "") => {
    try {
      setError(null);
      if (!user) throw new Error("Must be logged in");
      
      const request = await accessRequestsService.createAccessRequest(
        user.id,
        listingId,
        message
      );
      setAccessRequests((prev) => [request, ...prev]);
      return request;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Approuver demande d'accès (admin)
  const approveAccessRequest = async (id) => {
    try {
      setError(null);
      const updated = await accessRequestsService.approveRequest(id);
      setAccessRequests((prev) =>
        prev.map((req) => (req.id === id ? updated : req))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Rejeter demande d'accès (admin)
  const rejectAccessRequest = async (id) => {
    try {
      setError(null);
      const updated = await accessRequestsService.rejectRequest(id);
      setAccessRequests((prev) =>
        prev.map((req) => (req.id === id ? updated : req))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    listings,
    publicListings,
    adminListings,
    accessRequests,
    loading,
    error,
    addListing,
    updateListing,
    deleteListing,
    uploadImage,
    uploadDocument,
    submitAccessRequest,
    approveAccessRequest,
    rejectAccessRequest,
  };

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  return useContext(ListingsContext);
}