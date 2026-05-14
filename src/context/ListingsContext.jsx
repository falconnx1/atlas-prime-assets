import React, { createContext, useContext, useState } from "react";

// Donnees de depart (remplace par tes vrais terrains)
const initialListings = [
  {
    id: 1,
    title: "Terrain Bouznika Vue Mer",
    city: "Bouznika",
    type: "residential",
    price: "1,200,000",
    size: "500",
    description: "Magnifique terrain avec vue sur mer.",
    isPrivate: false,
    isVisible: true,
    cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    photos: [],
    pdfs: [],
  },
  {
    id: 2,
    title: "Terrain Agricole Meknes",
    city: "Meknes",
    type: "agricultural",
    price: "800,000",
    size: "2000",
    description: "Grand terrain agricole fertile.",
    isPrivate: true,
    isVisible: true,
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    photos: [],
    pdfs: [],
  },
];

// Creer le contexte
const ListingsContext = createContext();

// Provider : enveloppe toute ton app
export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(initialListings);
  const [accessRequests, setAccessRequests] = useState([]);

  // Ajouter un listing
  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: Date.now(),
      isVisible: true,
    };
    setListings((prev) => [newListing, ...prev]);
  };

  // Soumettre une demande d'accès Elite
  const submitAccessRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setAccessRequests((prev) => [newRequest, ...prev]);
  };

  const approveAccessRequest = (id) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  const rejectAccessRequest = (id) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "rejected" } : req
      )
    );
  };

  // Modifier un listing
  const updateListing = (id, updatedData) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updatedData } : l))
    );
  };

  // Supprimer un listing
  const deleteListing = (id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  // Toggle visibilite (public / prive)
  const togglePrivate = (id) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isPrivate: !l.isPrivate } : l))
    );
  };

  // Listings publics uniquement (pour le site)
  const publicListings = listings.filter((l) => !l.isPrivate && l.isVisible);

  return (
    <ListingsContext.Provider
      value={{
        listings,        // Tous les listings (pour le dashboard)
        publicListings,  // Listings publics (pour le site)
        addListing,
        updateListing,
        deleteListing,
        togglePrivate,
        accessRequests,
        submitAccessRequest,
        approveAccessRequest,
        rejectAccessRequest,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

// Hook pour utiliser le contexte facilement
export function useListings() {
  return useContext(ListingsContext);
}