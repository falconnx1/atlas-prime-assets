import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const labelStyle = { display: "block", color: "#d4d4d8", fontSize: "12px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" };
const inputStyle = { background: "#27272a", border: "1px solid #3f3f46", color: "#e4e4e7", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit" };

export const SignupForm = ({ setPage }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    investorType: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (formData.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      // Sign up with Supabase
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            investor_type: formData.investorType,
          },
        },
      });

      if (signupError) throw signupError;

      if (!data.user) {
        throw new Error("User creation failed");
      }

      console.log("✅ User created in Auth:", data.user.id);
      console.log("User metadata:", data.user.user_metadata);

      // The trigger should automatically insert into users table
      // But if you want to manually verify:
      try {
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.warn("User not yet in table (this is normal):", fetchError);
        } else if (userData) {
          console.log("✅ User data in database:", userData);
        }
      } catch (err) {
        console.log("Profile check skipped:", err.message);
      }

      setSuccess("Inscription réussie! Vérifiez votre email pour confirmer votre compte.");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        investorType: "",
        password: "",
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => setPage("dashboard"), 2000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ background: "rgba(39,39,42,0.8)", border: "1px solid rgba(202,138,4,0.15)", borderRadius: "12px", padding: "40px 32px", backdropFilter: "blur(10px)" }}>
        <h1 style={{ color: "#facc15", fontSize: "24px", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.05em" }}>
          Créer un Compte
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "32px" }}>
          Rejoignez le réseau privé Atlas Prime Assets
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

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Prénom *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Mohammed"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Alami"
                style={inputStyle}
                required
              />
            </div>
          </div>

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
            <label style={labelStyle}>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Profil Investisseur</label>
            <select
              name="investorType"
              value={formData.investorType}
              onChange={handleChange}
              style={{ ...inputStyle, color: "#71717a" }}
            >
              <option value="">Sélectionner...</option>
              <option value="investisseur-prive">Investisseur Privé</option>
              <option value="promoteur-immobilier">Promoteur Immobilier</option>
              <option value="fonds-investissement">Fonds d'Investissement</option>
              <option value="proprietaire-foncier">Propriétaire Foncier</option>
              <option value="agent-immobilier">Agent Immobilier</option>
            </select>
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

          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <input
              type="checkbox"
              id="cgu"
              required
              style={{ accentColor: "#eab308", marginTop: "2px" }}
            />
            <label htmlFor="cgu" style={{ color: "#71717a", fontSize: "12px", lineHeight: 1.6 }}>
              J'accepte les conditions d'utilisation et la politique de confidentialité d'Atlas Prime Assets.
            </label>
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
            {loading ? "Inscription en cours..." : "Créer mon Compte"}
          </button>

          <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px", textAlign: "center" }}>
            <span style={{ color: "#71717a", fontSize: "13px" }}>Déjà membre ? </span>
            <button
              type="button"
              onClick={() => setPage("login")}
              style={{
                background: "none",
                border: "none",
                color: "#facc15",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
