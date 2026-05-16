import { useState } from "react";
import { contactRequestsService, partnershipRequestsService, landSubmissionsService } from "../lib/supabaseService";

const labelStyle = { display: "block", color: "#d4d4d8", fontSize: "12px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" };
const inputStyle = { background: "rgba(39,39,42,0.8)", border: "1px solid #3f3f46", color: "#e4e4e7", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", width: "100%", fontFamily: "inherit" };

export const ContactForm = ({ setPage, type = "contact" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (type === "contact") {
        await contactRequestsService.createRequest({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          request_type: "contact",
        });
      } else if (type === "partnership") {
        await partnershipRequestsService.createRequest({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          partnership_type: formData.message || "general",
          message: "",
        });
      } else if (type === "land-submission") {
        await landSubmissionsService.createSubmission({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.company || "",
          terrain_type: formData.message || "",
          surface_area: "",
          description: "",
          price_expectation: "",
        });
      }

      setSuccess("✅ Votre demande a été envoyée avec succès! Atlas Prime Assets vous contactera bientôt.");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });

      // Redirect after 3 seconds
      setTimeout(() => setPage("home"), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi du formulaire");
      console.error("Form error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTitles = () => {
    switch (type) {
      case "contact":
        return { title: "Nous Contacter", subtitle: "Envoyez-nous vos questions ou demandes" };
      case "partnership":
        return { title: "Demande de Partenariat", subtitle: "Rejoignez le réseau Atlas Prime Assets" };
      case "land-submission":
        return { title: "Soumettre un Terrain", subtitle: "Proposez votre terrain à Atlas Prime Assets" };
      default:
        return { title: "Formulaire", subtitle: "" };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ background: "rgba(39,39,42,0.8)", border: "1px solid rgba(202,138,4,0.15)", borderRadius: "12px", padding: "40px 32px", backdropFilter: "blur(10px)" }}>
        <h1 style={{ color: "#facc15", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
          {title}
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "32px" }}>
          {subtitle}
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
            <label style={labelStyle}>Nom complet *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Mohammed Alami"
              style={inputStyle}
              required
            />
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
            <label style={labelStyle}>Téléphone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              style={inputStyle}
              required
            />
          </div>

          {(type === "partnership" || type === "land-submission") && (
            <div>
              <label style={labelStyle}>
                {type === "partnership" ? "Entreprise" : "Ville"}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={type === "partnership" ? "Nom de votre entreprise" : "Ville où se situe le terrain"}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Message/Détails *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez votre demande en détail..."
              style={{
                ...inputStyle,
                minHeight: "120px",
                resize: "vertical",
              }}
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
            {loading ? "Envoi en cours..." : "Envoyer"}
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
