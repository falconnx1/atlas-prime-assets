import { useListings } from "./context/ListingsContext";
import { useState } from "react";

function AdminDashboard({ onLogout }) {
  const {
    listings,
    addListing,
    deleteListing,
    togglePrivate,
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
  } = useListings();
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    type: "terrain",
    price: "",
    description: "",
    photos: [],
    document: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const handleDocumentUpload = (e) => {
    setFormData(prev => ({ ...prev, document: e.target.files[0] }));
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city || !formData.price) {
      alert("Remplis tous les champs requis !");
      return;
    }

    addListing({
      id: Date.now(),
      ...formData,
      isPrivate: false,
    });

    // Réinitialise le formulaire
    setFormData({
      name: "",
      city: "",
      type: "terrain",
      price: "",
      description: "",
      photos: [],
      document: null,
    });

    alert("✅ Listing ajouté avec succès !");
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce listing ?")) {
      deleteListing(id);
    }
  };

  const handleTogglePrivate = (id) => {
    togglePrivate(id);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", color: "#333" }}>
          📊 Tableau de Bord Admin
        </h1>
        <button
          onClick={onLogout}
          style={{
            background: "#dc2626",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: "1px solid #ddd",
      }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>
          📨 Demandes d'Accès Elite
        </h2>
        {accessRequests.length === 0 ? (
          <p style={{ color: "#666", fontSize: "15px" }}>
            Aucune demande en attente pour le moment.
          </p>
        ) : (
          accessRequests.map((request) => (
            <div key={request.id} style={{ marginBottom: "15px", padding: "15px", border: "1px solid #eee", borderRadius: "8px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#333" }}>{request.name}</div>
                  <div style={{ color: "#666", fontSize: "13px" }}>{request.email}</div>
                </div>
                <span style={{ fontSize: "12px", color: request.status === "approved" ? "#16a34a" : request.status === "rejected" ? "#dc2626" : "#d97706", fontWeight: 700, textTransform: "uppercase" }}>
                  {request.status}
                </span>
              </div>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>Investissement :</strong> {request.capacity} MAD</p>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>Secteur :</strong> {request.sector}</p>
              {request.message && <p style={{ color: "#555", marginBottom: "10px" }}><strong>Message :</strong> {request.message}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => approveAccessRequest(request.id)}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Approuver
                </button>
                <button
                  onClick={() => rejectAccessRequest(request.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Refuser
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORMULAIRE D'AJOUT */}
      <div style={{
        background: "#f9f9f9",
        padding: "30px",
        borderRadius: "8px",
        marginBottom: "40px",
        border: "1px solid #ddd"
      }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>
          ➕ Ajouter un Listing
        </h2>

        <form onSubmit={handleAddListing}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Nom du terrain *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Terrain à Casablanca"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Ville *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Ex: Casablanca"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            >
              <option>terrain</option>
              <option>maison</option>
              <option>appartement</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Prix (DH) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Ex: 500000"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décris le terrain..."
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
                fontFamily: "Arial"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ width: "100%", padding: "10px" }}
            />
            {formData.photos.length > 0 && (
              <p style={{ marginTop: "10px", color: "#666" }}>
                ✅ {formData.photos.length} photo(s) sélectionnée(s)
              </p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Document PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleDocumentUpload}
              style={{ width: "100%", padding: "10px" }}
            />
            {formData.document && (
              <p style={{ marginTop: "10px", color: "#666" }}>
                ✅ Document sélectionné : {formData.document.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ➕ Ajouter Listing
          </button>
        </form>
      </div>

      {/* LISTE DES LISTINGS */}
      <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>
        📋 Listings Actuels ({listings.length})
      </h2>

      {listings.length === 0 ? (
        <p style={{ color: "#999", fontSize: "16px" }}>Aucun listing pour le moment...</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing.id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>
              {listing.name || listing.title}
            </h3>
            <p style={{ color: "#666", marginBottom: "5px" }}>
              📍 {listing.city}
            </p>
            <p style={{ color: "#666", marginBottom: "5px" }}>
              🏠 {listing.type}
            </p>
            <p style={{ color: "#666", marginBottom: "5px" }}>
              💰 {listing.price} DH
            </p>
            {listing.description && (
              <p style={{ color: "#666", marginBottom: "10px" }}>
                {listing.description}
              </p>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={() => handleTogglePrivate(listing.id)}
                style={{
                  background: listing.isPrivate ? "#FFC107" : "#28A745",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                {listing.isPrivate ? "🔒 Privé" : "🌐 Public"}
              </button>
              <button
                onClick={() => handleDelete(listing.id)}
                style={{
                  background: "#DC3545",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
