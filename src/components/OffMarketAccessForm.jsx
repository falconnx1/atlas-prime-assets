import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";

const labelStyle = { display: "block", color: "#d4d4d8", fontSize: "12px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" };
const inputStyle = { background: "rgba(39,39,42,0.8)", border: "1px solid #3f3f46", color: "#e4e4e7", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit" };

export const OffMarketAccessForm = ({ listingTitle, listingId, setPage }) => {
  const { isAuthenticated, user } = useAuth();
  const { submitAccessRequest } = useListings();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "rgba(39,39,42,0.8)", border: "1px solid rgba(202,138,4,0.15)", borderRadius: "12px", padding: "40px 32px", textAlign: "center" }}>
          <h2 style={{ color: "#facc15", marginBottom: "16px" }}>Connexion requise</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "24px" }}>
            Vous devez être connecté pour demander l'accès à ce terrain privé.
          </p>
          <button
            onClick={() => setPage("login")}
            style={{
              background: "#eab308",
              color: "#000",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "12px 24px",
              borderRadius: "8px",
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error("Vous devez être authentifié");
      }

      await submitAccessRequest(listingId, message);
      setSuccess("✅ Votre demande d'accès a été envoyée! Notre équipe l'examinera et vous contactera.");
      setMessage("");

      setTimeout(() => setPage("home"), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi de la demande");
      console.error("Access request error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ background: "rgba(39,39,42,0.8)", border: "1px solid rgba(202,138,4,0.15)", borderRadius: "12px", padding: "40px 32px", backdropFilter: "blur(10px)" }}>
        <h1 style={{ color: "#facc15", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
          Demander l'Accès
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "8px" }}>
          Terrain: <strong>{listingTitle}</strong>
        </p>
        <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "32px" }}>
          Complétez le formulaire ci-dessous et notre équipe examinera votre demande.
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "12px",
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#6ee7b7",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "12px",
            marginBottom: "16px",
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Nom d'investisseur</label>
            <input
              type="text"
              value={user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}` : user?.email}
              disabled
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </div>

          <div>
            <label style={labelStyle}>Profil d'investisseur</label>
            <input
              type="text"
              value={user?.user_metadata?.investor_type || "Non spécifié"}
              disabled
              style={{ ...inputStyle, opacity: 0.7 }}
            />
          </div>

          <div>
            <label style={labelStyle}>Message (optionnel)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez votre intérêt pour ce terrain..."
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#a3a304" : "#eab308",
              color: "#000",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "14px",
              borderRadius: "8px",
              transition: "background 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#facc15")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#eab308")}
          >
            {loading ? "Envoi en cours..." : "Envoyer la Demande"}
          </button>

          <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px", textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setPage("home")}
              style={{
                background: "none",
                border: "none",
                color: "#facc15",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Retour à l'accueil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
