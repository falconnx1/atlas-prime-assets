import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const labelStyle = { display: "block", color: "#d4d4d8", fontSize: "12px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" };
const inputStyle = { background: "#27272a", border: "1px solid #3f3f46", color: "#e4e4e7", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit" };

export const LoginForm = ({ setPage }) => {
  const { signin } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signin(formData.email, formData.password);
      setPage("dashboard");
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ background: "rgba(39,39,42,0.8)", border: "1px solid rgba(202,138,4,0.15)", borderRadius: "12px", padding: "40px 32px", backdropFilter: "blur(10px)" }}>
        <h1 style={{ color: "#facc15", fontSize: "24px", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.05em" }}>
          Connexion
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "32px" }}>
          Accédez à votre compte Atlas Prime Assets
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={inputStyle}
              required
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
            {loading ? "Connexion en cours..." : "Se Connecter"}
          </button>

          <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px", textAlign: "center" }}>
            <span style={{ color: "#71717a", fontSize: "13px" }}>Pas encore inscrit ? </span>
            <button
              type="button"
              onClick={() => setPage("signup")}
              style={{
                background: "none",
                border: "none",
                color: "#facc15",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
