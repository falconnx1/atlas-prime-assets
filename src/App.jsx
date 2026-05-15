import { useState, useEffect } from "react";
import { SignupForm } from "./components/SignupForm";

const waLink = (msg) =>
  `https://wa.me/212772367438?text=${encodeURIComponent(msg)}`;

const terrains = [
  {
    id: 1,
    titre: "Terrain Urbain Haut Standing",
    ville: "Casablanca",
    surface: "2 400 m²",
    potentiel: "Résidentiel R+6",
    statut: "Disponible",
    type: "Urbain",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  },
  {
    id: 2,
    titre: "Lotissement Prestige Bord de Mer",
    ville: "Agadir",
    surface: "12 000 m²",
    potentiel: "Touristique / Résidentiel",
    statut: "Disponible",
    type: "Lotissement",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  },
  {
    id: 3,
    titre: "Zone Industrielle Logistique",
    ville: "Tanger",
    surface: "35 000 m²",
    potentiel: "Entrepôts / Usines",
    statut: "Sous Compromis",
    type: "Industriel",
    img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80",
  },
  {
    id: 4,
    titre: "Resort Touristique Exclusif",
    ville: "Marrakech",
    surface: "8 500 m²",
    potentiel: "Hôtelier 5 étoiles",
    statut: "Disponible",
    type: "Touristique",
    img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80",
  },
  {
    id: 5,
    titre: "Terrain Résidentiel Quartier Neuf",
    ville: "Rabat",
    surface: "5 200 m²",
    potentiel: "Promotion Immobilière",
    statut: "Disponible",
    type: "Urbain",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
  {
    id: 6,
    titre: "Parc Industriel Nouvelle Zone",
    ville: "Kenitra",
    surface: "20 000 m²",
    potentiel: "Industrie Légère",
    statut: "Disponible",
    type: "Industriel",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
  },
];

const partenariats = [
  {
    titre: "Joint-Venture Promoteurs",
    desc: "Co-investissement sur des projets de grande envergure avec partage équitable des bénéfices et gouvernance structurée.",
    tag: "JV",
  },
  {
    titre: "Collaboration Propriétaires",
    desc: "Mandat exclusif de valorisation de vos terrains via notre réseau d'investisseurs institutionnels et privés.",
    tag: "Propriétaires",
  },
  {
    titre: "Réseau Agents Agréés",
    desc: "Intégrez notre réseau partenaire et accédez à un portefeuille off-market réservé aux agents certifiés Atlas Prime.",
    tag: "Agents",
  },
];

/* ── Helpers ── */
const GoldDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(202,138,4,0.6))" }} />
    <div style={{ width: "6px", height: "6px", background: "#eab308", transform: "rotate(45deg)" }} />
    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(202,138,4,0.6))" }} />
  </div>
);

const Badge = ({ children, color = "gold" }) => {
  const styles = {
    gold: { background: "rgba(234,179,8,0.1)", color: "#facc15", border: "1px solid rgba(234,179,8,0.3)" },
    green: { background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" },
    red: { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" },
  };
  const c = children === "Sous Compromis" ? "red" : children === "Disponible" ? "green" : color;
  return (
    <span style={{
      ...styles[c],
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px",
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
};

const WhatsAppBtn = ({ message = "Bonjour, je suis intéressé par Atlas Prime Assets.", small = false }) => (
  <a
    href={waLink(message)}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex", alignItems: "center", gap: small ? "6px" : "8px",
      background: "#059669", color: "#fff", fontWeight: 600, borderRadius: "8px",
      padding: small ? "8px 16px" : "12px 24px", fontSize: small ? "13px" : "14px",
      textDecoration: "none", transition: "background 0.2s",
      letterSpacing: "0.02em",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "#10b981"}
    onMouseLeave={e => e.currentTarget.style.background = "#059669"}
  >
    <svg width={small ? 16 : 18} height={small ? 16 : 18} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    WhatsApp
  </a>
);

const Logo = ({ onClick, size = "md" }) => {
  const s = size === "sm" ? 28 : 36;
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <div style={{ position: "relative", width: s, height: s }}>
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid #eab308", transform: "rotate(45deg)", transition: "transform 0.4s" }} />
        <div style={{ position: "absolute", inset: "6px", background: "#eab308", transform: "rotate(45deg)", transition: "transform 0.4s" }} />
      </div>
      <div style={{ textAlign: "left" }}>
        <div style={{ color: "#fff", fontWeight: 700, letterSpacing: "0.15em", fontSize: size === "sm" ? "11px" : "13px", textTransform: "uppercase", lineHeight: 1 }}>Atlas Prime</div>
        <div style={{ color: "#eab308", fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase", marginTop: "3px", lineHeight: 1 }}>Assets</div>
      </div>
    </button>
  );
};

/* ── Nav ── */
const Nav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id: "home", label: "Accueil" },
    { id: "marketplace", label: "Marketplace" },
    { id: "offmarket", label: "Off-Market Elite" },
    { id: "partenariats", label: "Partenariats" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.4s",
      background: scrolled ? "rgba(0,0,0,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(202,138,4,0.15)" : "none",
      padding: scrolled ? "12px 0" : "20px 0",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo onClick={() => setPage("home")} />

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden-mobile">
          {links.map((l) => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: page === l.id ? "#facc15" : "#a1a1aa",
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "4px 0", position: "relative",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => { if (page !== l.id) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { if (page !== l.id) e.currentTarget.style.color = "#a1a1aa"; }}
            >
              {l.label}
              <span style={{
                position: "absolute", bottom: "-2px", left: 0,
                height: "1px", background: "#eab308",
                width: page === l.id ? "100%" : "0", transition: "width 0.3s",
              }} />
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hidden-mobile">
          <button onClick={() => setPage("login")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#a1a1aa", fontSize: "11px", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#facc15"}
            onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}
          >
            Connexion
          </button>
          <button onClick={() => setPage("signup")} style={{
            background: "#eab308", color: "#000", border: "none", cursor: "pointer",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "10px 20px", borderRadius: "6px",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#facc15"}
            onMouseLeave={e => e.currentTarget.style.background = "#eab308"}
          >
            Espace Investisseur
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="show-mobile" style={{
          background: "none", border: "none", cursor: "pointer",
          display: "none", flexDirection: "column", gap: "5px", padding: "4px",
        }}>
          <span style={{ display: "block", width: "24px", height: "1px", background: "#fff", transition: "all 0.3s", transform: open ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <span style={{ display: "block", width: "24px", height: "1px", background: "#eab308", transition: "all 0.3s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "24px", height: "1px", background: "#fff", transition: "all 0.3s", transform: open ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      </div>

      {open && (
        <div style={{
          background: "rgba(0,0,0,0.98)", borderTop: "1px solid rgba(202,138,4,0.15)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px",
        }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => { setPage(l.id); setOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              color: page === l.id ? "#facc15" : "#d4d4d8",
              fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              {l.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: "10px", paddingTop: "12px", borderTop: "1px solid #27272a" }}>
            <button onClick={() => { setPage("login"); setOpen(false); }} style={{
              flex: 1, border: "1px solid rgba(202,138,4,0.4)", background: "none",
              color: "#facc15", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "10px", borderRadius: "6px", cursor: "pointer",
            }}>Connexion</button>
            <button onClick={() => { setPage("signup"); setOpen(false); }} style={{
              flex: 1, background: "#eab308", border: "none", color: "#000",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "10px", borderRadius: "6px", cursor: "pointer",
            }}>S'inscrire</button>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ── TerrainCard ── */
const TerrainCard = ({ t, locked = false }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: hover ? "1px solid rgba(202,138,4,0.4)" : "1px solid #27272a",
        background: "#0a0a0a", borderRadius: "12px", overflow: "hidden",
        transition: "all 0.4s", transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 20px 40px rgba(0,0,0,0.5)" : "none",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img src={t.img} alt={t.titre} style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: locked ? "blur(8px)" : "none",
          transform: hover ? "scale(1.08)" : locked ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.7s",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <span style={{
            background: "rgba(0,0,0,0.7)", border: "1px solid rgba(202,138,4,0.3)",
            color: "#facc15", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px",
          }}>{t.type}</span>
        </div>
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <Badge color={t.statut === "Disponible" ? "green" : "red"}>{t.statut}</Badge>
        </div>
        {locked && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(202,138,4,0.4)", borderRadius: "12px",
              padding: "16px 24px", textAlign: "center",
            }}>
              <svg width="28" height="28" fill="none" stroke="#facc15" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <div style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Accès Restreint</div>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "20px" }}>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "17px", fontWeight: 700, color: hover ? "#fde047" : "#fff",
          marginBottom: "6px", transition: "color 0.3s",
          filter: locked ? "blur(4px)" : "none", userSelect: locked ? "none" : "auto",
        }}>
          {locked ? "Opportunité Confidentielle" : t.titre}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#71717a", fontSize: "13px", marginBottom: "16px", filter: locked ? "blur(4px)" : "none" }}>
          <svg width="13" height="13" fill="#ca8a04" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          {t.ville}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          {[["Surface", locked ? "X XXX m²" : t.surface], ["Potentiel", locked ? "Classifié" : t.potentiel]].map(([k, v]) => (
            <div key={k} style={{ background: "#111", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ color: "#52525b", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{k}</div>
              <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, filter: locked ? "blur(4px)" : "none" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {locked ? (
            <button style={{
              flex: 1, background: "#eab308", color: "#000", border: "none",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "10px", borderRadius: "6px", cursor: "pointer",
            }}>Demander l'Accès</button>
          ) : (
            <>
              <WhatsAppBtn message={`Bonjour, je suis intéressé par le terrain "${t.titre}" à ${t.ville}.`} small />
              <button style={{
                flex: 1, border: "1px solid #3f3f46", background: "none",
                color: "#a1a1aa", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "8px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(202,138,4,0.5)"; e.currentTarget.style.color = "#facc15"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = "#a1a1aa"; }}
              >
                Voir Dossier
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Section Header ── */
const SectionHeader = ({ eyebrow, title, centered = false }) => (
  <div style={{ textAlign: centered ? "center" : "left", marginBottom: "48px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: centered ? "center" : "flex-start", marginBottom: "16px" }}>
      {centered && <div style={{ width: "24px", height: "1px", background: "#eab308" }} />}
      {!centered && <div style={{ width: "24px", height: "1px", background: "#eab308" }} />}
      <span style={{ color: "#eab308", fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>{eyebrow}</span>
      {centered && <div style={{ width: "24px", height: "1px", background: "#eab308" }} />}
    </div>
    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15 }}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  </div>
);

/* ── HOME ── */
const Home = ({ setPage }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{ background: "#000", color: "#fff" }}>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, #000 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9), transparent, rgba(0,0,0,0.4))" }} />
        </div>

        <div style={{ position: "absolute", top: 0, left: "50%", width: "1px", height: "120px", background: "linear-gradient(to bottom, rgba(234,179,8,0.5), transparent)" }} />
        <div style={{ position: "absolute", bottom: 80, left: "50%", width: "1px", height: "100px", background: "linear-gradient(to top, rgba(234,179,8,0.5), transparent)" }} />

        <div style={{
          position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px",
          paddingTop: "140px", paddingBottom: "100px",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 1s ease",
        }}>
          <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{ width: "32px", height: "1px", background: "#eab308" }} />
              <span style={{ color: "#eab308", fontSize: "11px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" }}>
                Réseau Privé d'Investissement Foncier
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(38px, 6vw, 72px)",
              fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em",
              color: "#fff", marginBottom: "20px",
            }}>
              Opportunités{" "}
              <span style={{ backgroundImage: "linear-gradient(135deg, #facc15, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Foncières
              </span>{" "}
              Stratégiques au Maroc
            </h1>

            <GoldDivider />

            <p style={{ color: "#d4d4d8", fontSize: "16px", lineHeight: 1.75, marginTop: "20px", marginBottom: "36px", maxWidth: "560px" }}>
              Atlas Prime Assets est la plateforme institutionnelle de référence pour l'investissement foncier stratégique au Royaume. Accédez à un portefeuille sélectionné de terrains d'exception.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <button onClick={() => setPage("marketplace")} style={{
                background: "#eab308", color: "#000", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", padding: "14px 28px", borderRadius: "6px",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#facc15"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#eab308"; e.currentTarget.style.transform = "none"; }}
              >
                Voir la Marketplace
              </button>
              <button onClick={() => setPage("offmarket")} style={{
                background: "none", border: "1px solid rgba(202,138,4,0.5)", cursor: "pointer",
                color: "#facc15", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", padding: "14px 28px", borderRadius: "6px",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#eab308"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(202,138,4,0.5)"; e.currentTarget.style.transform = "none"; }}
              >
                Accès Off-Market Elite
              </button>
              <WhatsAppBtn message="Bonjour Atlas Prime Assets, je souhaite en savoir plus sur vos opportunités foncières." />
            </div>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: "1px solid rgba(202,138,4,0.15)",
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[["150+", "Terrains Gérés"], ["12", "Villes au Maroc"], ["800M MAD+", "Actifs Traités"], ["100%", "Confidentiel"]].map(([v, l], i) => (
              <div key={l} style={{
                padding: "20px 24px",
                borderRight: i < 3 ? "1px solid rgba(202,138,4,0.12)" : "none",
              }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#facc15", fontSize: "26px", fontWeight: 700, lineHeight: 1 }}>{v}</div>
                <div style={{ color: "#52525b", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "6px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "96px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "1px", background: "#eab308" }} />
              <span style={{ color: "#eab308", fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>Sélection Premium</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff" }}>Marketplace Terrains</h2>
          </div>
          <button onClick={() => setPage("marketplace")} style={{
            background: "none", border: "1px solid rgba(202,138,4,0.35)", color: "#facc15",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "12px 24px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#eab308"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(202,138,4,0.35)"}
          >
            Voir Tous les Listings
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {terrains.slice(0, 3).map((t) => <TerrainCard key={t.id} t={t} />)}
        </div>
      </section>

      <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #09090b, #000)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at center, rgba(202,138,4,0.07) 0%, transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "24px", height: "1px", background: "#eab308" }} />
            <span style={{ color: "#eab308", fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>Confidentiel</span>
            <div style={{ width: "24px", height: "1px", background: "#eab308" }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
            Off-Market <span style={{ color: "#facc15" }}>Elite</span>
          </h2>
          <p style={{ color: "#71717a", fontSize: "15px", lineHeight: 1.7, marginBottom: "36px" }}>
            Accédez à des opportunités foncières exclusives, jamais publiées, réservées à nos investisseurs qualifiés. Un univers à part, sous NDA.
          </p>
          <button onClick={() => setPage("offmarket")} style={{
            background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.35)",
            color: "#facc15", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "14px 32px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(234,179,8,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(234,179,8,0.08)"}
          >
            Demander l'Accès
          </button>
        </div>
      </section>

      <section style={{ padding: "96px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="stack-mobile">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "24px", height: "1px", background: "#eab308" }} />
              <span style={{ color: "#eab308", fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>Collaboration</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
              Partenariats Stratégiques
            </h2>
            <p style={{ color: "#71717a", fontSize: "15px", lineHeight: 1.75, marginBottom: "32px" }}>
              Nous structurons des joint-ventures entre promoteurs, propriétaires fonciers et investisseurs institutionnels pour maximiser la création de valeur sur chaque actif.
            </p>
            <button onClick={() => setPage("partenariats")} style={{
              background: "#eab308", color: "#000", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "14px 28px", borderRadius: "6px", transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#facc15"}
              onMouseLeave={e => e.currentTarget.style.background = "#eab308"}
            >
              Explorer les Partenariats
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {partenariats.map((p) => (
              <PartCard key={p.titre} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "96px 24px", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
            Rejoignez le Réseau <span style={{ color: "#facc15" }}>Atlas Prime</span>
          </h2>
          <p style={{ color: "#71717a", fontSize: "15px", lineHeight: 1.75, marginBottom: "36px" }}>
            Investisseurs qualifiés, promoteurs et propriétaires — découvrez comment Atlas Prime Assets peut transformer vos actifs fonciers en opportunités à forte valeur ajoutée.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => setPage("signup")} style={{
              background: "#eab308", color: "#000", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "14px 28px", borderRadius: "6px", transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#facc15"}
              onMouseLeave={e => e.currentTarget.style.background = "#eab308"}
            >
              Créer Mon Compte
            </button>
            <WhatsAppBtn message="Bonjour, je souhaite rejoindre le réseau Atlas Prime Assets." />
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
};

const PartCard = ({ p }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: hover ? "1px solid rgba(202,138,4,0.35)" : "1px solid #27272a",
        background: "#09090b", borderRadius: "10px", padding: "20px",
        transition: "all 0.3s", cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <div style={{ color: hover ? "#fde047" : "#fff", fontWeight: 600, fontSize: "15px", marginBottom: "6px", transition: "color 0.3s" }}>{p.titre}</div>
          <div style={{ color: "#71717a", fontSize: "13px", lineHeight: 1.6 }}>{p.desc}</div>
        </div>
        <Badge>{p.tag}</Badge>
      </div>
    </div>
  );
};

/* ── MARKETPLACE ── */
const Marketplace = () => {
  const [filter, setFilter] = useState("Tous");
  const types = ["Tous", "Urbain", "Lotissement", "Industriel", "Touristique"];
  const filtered = filter === "Tous" ? terrains : terrains.filter((t) => t.type === filter);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <SectionHeader eyebrow="Catalogue Foncier" title="Marketplace Terrains" />
        <p style={{ color: "#71717a", fontSize: "15px", lineHeight: 1.7, maxWidth: "520px", marginTop: "-32px", marginBottom: "40px" }}>
          Sélection rigoureuse de terrains à fort potentiel à travers le Royaume du Maroc. Chaque actif est audité par notre équipe d'experts fonciers.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "48px" }}>
          {types.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "9px 20px", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              borderRadius: "999px", cursor: "pointer", transition: "all 0.2s",
              background: filter === t ? "#eab308" : "transparent",
              color: filter === t ? "#000" : "#71717a",
              border: filter === t ? "1px solid #eab308" : "1px solid #3f3f46",
            }}
              onMouseEnter={e => { if (filter !== t) { e.currentTarget.style.borderColor = "rgba(202,138,4,0.5)"; e.currentTarget.style.color = "#facc15"; } }}
              onMouseLeave={e => { if (filter !== t) { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = "#71717a"; } }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {filtered.map((t) => <TerrainCard key={t.id} t={t} />)}
        </div>

        <div style={{
          marginTop: "72px", border: "1px solid rgba(202,138,4,0.2)",
          background: "#09090b", borderRadius: "16px", padding: "48px",
          textAlign: "center",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            Vous avez un terrain à valoriser ?
          </h3>
          <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>
            Soumettez votre actif foncier à notre comité d'experts pour une évaluation confidentielle.
          </p>
          <WhatsAppBtn message="Bonjour, je souhaite soumettre mon terrain à Atlas Prime Assets pour évaluation." />
        </div>
      </div>
    </div>
  );
};

/* ── OFF MARKET ── */
const OffMarket = ({ setPage }) => {
  const lockedListings = [
    { id: 101, titre: "OC #001", ville: "Casablanca", surface: "X XXX m²", potentiel: "Classifié", statut: "Disponible", type: "Premium", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
    { id: 102, titre: "OC #002", ville: "Marrakech", surface: "X XXX m²", potentiel: "Classifié", statut: "Disponible", type: "Premium", img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=80" },
    { id: 103, titre: "OC #003", ville: "Tanger", surface: "X XXX m²", potentiel: "Classifié", statut: "Disponible", type: "Premium", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
  ];

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)",
            padding: "8px 20px", borderRadius: "999px", marginBottom: "24px",
          }}>
            <svg width="14" height="14" fill="none" stroke="#facc15" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span style={{ color: "#facc15", fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>Confidentiel — Accès Restreint</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#fff", marginBottom: "20px" }}>
            Off-Market <span style={{ color: "#facc15" }}>Elite</span>
          </h1>
          <p style={{ color: "#71717a", fontSize: "15px", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto" }}>
            Ces opportunités ne sont jamais publiées sur le marché ouvert. Accès exclusif réservé aux investisseurs qualifiés membres du réseau Atlas Prime, sous accord de confidentialité.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px", marginBottom: "56px" }}>
          {lockedListings.map((t) => <TerrainCard key={t.id} t={t} locked />)}
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", border: "1px solid rgba(202,138,4,0.25)", background: "#09090b", borderRadius: "16px", padding: "48px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "56px", height: "56px", background: "rgba(234,179,8,0.08)",
              border: "1px solid rgba(234,179,8,0.25)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" fill="none" stroke="#facc15" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Demander l'Accès Elite</h3>
            <p style={{ color: "#71717a", fontSize: "13px" }}>Réservé aux investisseurs avec une capacité minimum de 5 millions MAD.</p>
          </div>
          <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <InputField placeholder="Nom complet" />
              <InputField placeholder="Email professionnel" type="email" />
            </div>
            <InputField placeholder="Capacité d'investissement (MAD)" />
            <InputField placeholder="Secteur / Type de bien recherché" />
            <TextAreaField placeholder="Présentez votre profil investisseur..." rows={3} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <input type="checkbox" id="nda" style={{ accentColor: "#eab308", marginTop: "2px" }} />
              <label htmlFor="nda" style={{ color: "#71717a", fontSize: "12px", lineHeight: 1.6 }}>
                J'accepte de signer un accord de confidentialité (NDA) avant toute divulgation.
              </label>
            </div>
            <SubmitBtn>Soumettre ma Demande d'Accès</SubmitBtn>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ── PARTENARIATS ── */
const Partenariats = () => {
  const cards = [
    {
      iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      titre: "Joint-Venture Promoteurs", tag: "JV",
      desc: "Nous co-investissons avec des promoteurs immobiliers sur des projets structurés, avec un cadre juridique et financier solide assurant la protection de toutes les parties.",
      avantages: ["Partage équitable des bénéfices", "Montage juridique sécurisé", "Accès réseau investisseurs", "Due diligence offerte"],
    },
    {
      iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      titre: "Propriétaires Fonciers", tag: "Propriétaires",
      desc: "Vous possédez un terrain dormant ? Atlas Prime Assets prend en charge la valorisation complète de votre actif via notre réseau d'acheteurs qualifiés, en toute discrétion.",
      avantages: ["Mandat exclusif ou simple", "Évaluation gratuite", "Acheteurs qualifiés", "Transactions confidentielles"],
    },
    {
      iconPath: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      titre: "Agents & Conseillers", tag: "Agents",
      desc: "Intégrez le réseau Atlas Prime en tant que partenaire agréé. Accédez à notre portefeuille off-market et bénéficiez de commissions compétitives sur chaque transaction conclue.",
      avantages: ["Portefeuille off-market exclusif", "Commissions attractives", "Formation & support", "Badge partenaire certifié"],
    },
  ];

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <SectionHeader eyebrow="Collaboration Stratégique" title={`Partenariats <span style="color:#facc15">Atlas Prime</span>`} centered />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginBottom: "72px" }}>
          {cards.map((c) => <PartnerCard key={c.titre} c={c} />)}
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", border: "1px solid rgba(202,138,4,0.25)", background: "#09090b", borderRadius: "16px", padding: "48px" }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "8px" }}>Soumettre une Proposition</h3>
          <p style={{ color: "#71717a", fontSize: "13px", textAlign: "center", marginBottom: "32px" }}>Notre équipe étudiera votre dossier sous 48h ouvrées.</p>
          <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <InputField placeholder="Nom / Société" />
              <InputField placeholder="Type de partenariat" />
            </div>
            <InputField placeholder="Email" type="email" />
            <InputField placeholder="Téléphone" />
            <TextAreaField placeholder="Décrivez votre proposition de partenariat..." rows={4} />
            <SubmitBtn>Envoyer ma Proposition</SubmitBtn>
          </form>
        </div>
      </div>
    </div>
  );
};

const PartnerCard = ({ c }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: hover ? "1px solid rgba(202,138,4,0.35)" : "1px solid #27272a",
        background: "#09090b", borderRadius: "14px", padding: "32px",
        transition: "all 0.4s", transform: hover ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{
        width: "44px", height: "44px",
        background: hover ? "rgba(234,179,8,0.18)" : "rgba(234,179,8,0.08)",
        border: "1px solid rgba(234,179,8,0.2)", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
        transition: "background 0.3s",
      }}>
        <svg width="22" height="22" fill="none" stroke="#facc15" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={c.iconPath} />
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "17px", fontWeight: 700, color: hover ? "#fde047" : "#fff", transition: "color 0.3s" }}>{c.titre}</h3>
        <Badge>{c.tag}</Badge>
      </div>
      <p style={{ color: "#71717a", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>{c.desc}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {c.avantages.map((a) => (
          <li key={a} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#d4d4d8", fontSize: "13px" }}>
            <div style={{ width: "5px", height: "5px", background: "#eab308", borderRadius: "50%", flexShrink: 0 }} />
            {a}
          </li>
        ))}
      </ul>
      <WhatsAppBtn message={`Bonjour, je suis intéressé par le partenariat "${c.titre}" chez Atlas Prime Assets.`} small />
    </div>
  );
};

/* ── CONTACT ── */
const Contact = () => (
  <div style={{ background: "#000", color: "#fff", minHeight: "100vh", paddingTop: "100px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <SectionHeader eyebrow="Nous Contacter" title={`Contact <span style="color:#facc15">Atlas Prime</span>`} centered />
      <p style={{ color: "#71717a", fontSize: "15px", textAlign: "center", marginTop: "-32px", marginBottom: "48px" }}>
        Notre équipe d'experts répond à toutes vos demandes sous 24h ouvrées.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", maxWidth: 1100, margin: "0 auto" }}>
        {[
          { titre: "Demande Investisseur", desc: "Vous souhaitez investir dans l'immobilier foncier au Maroc.", placeholder: "Capacité d'investissement, villes cibles, type de bien..." },
          { titre: "Depot de Terrain", desc: "Vous êtes propriétaire et souhaitez valoriser votre terrain.", placeholder: "Localisation, surface, titre foncier, prix souhaité..." },
          { titre: "Demande Partenariat", desc: "Vous souhaitez collaborer en tant que promoteur ou agent.", placeholder: "Type de partenariat, projets en cours, zone géographique..." },
        ].map((f) => (
          <ContactCard key={f.titre} f={f} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "56px", flexWrap: "wrap" }}>
        <WhatsAppBtn message="Bonjour Atlas Prime Assets, je souhaite vous contacter." />
        <a href="mailto:contact@atlasprimeassets.ma" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          border: "1px solid #3f3f46", color: "#a1a1aa",
          padding: "12px 24px", borderRadius: "8px", fontSize: "13px",
          fontWeight: 500, textDecoration: "none", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(202,138,4,0.5)"; e.currentTarget.style.color = "#facc15"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = "#a1a1aa"; }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          contact@atlasprimeassets.ma
        </a>
      </div>
    </div>
  </div>
);

const ContactCard = ({ f }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: hover ? "1px solid rgba(202,138,4,0.25)" : "1px solid #27272a",
        background: "#09090b", borderRadius: "14px", padding: "28px", transition: "border 0.3s",
      }}
    >
      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{f.titre}</h3>
      <p style={{ color: "#71717a", fontSize: "12px", lineHeight: 1.65, marginBottom: "20px" }}>{f.desc}</p>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={(e) => e.preventDefault()}>
        <InputField placeholder="Nom complet" />
        <InputField placeholder="Email" type="email" />
        <InputField placeholder="Téléphone" />
        <TextAreaField placeholder={f.placeholder} rows={3} />
        <SubmitBtn>Envoyer</SubmitBtn>
      </form>
    </div>
  );
};

/* ── Form helpers ── */
const inputStyle = {
  background: "#111", border: "1px solid #27272a", color: "#fff",
  padding: "11px 14px", borderRadius: "8px", fontSize: "13px",
  outline: "none", width: "100%", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s",
};

const InputField = ({ placeholder, type = "text" }) => {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type} placeholder={placeholder}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ ...inputStyle, borderColor: focus ? "rgba(234,179,8,0.5)" : "#27272a" }}
    />
  );
};

const TextAreaField = ({ placeholder, rows = 3 }) => {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      rows={rows} placeholder={placeholder}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ ...inputStyle, resize: "none", borderColor: focus ? "rgba(234,179,8,0.5)" : "#27272a" }}
    />
  );
};

const SubmitBtn = ({ children }) => (
  <button type="submit" style={{
    background: "#eab308", color: "#000", border: "none", cursor: "pointer",
    fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", padding: "13px", borderRadius: "8px",
    width: "100%", transition: "background 0.2s", fontFamily: "inherit",
  }}
    onMouseEnter={e => e.currentTarget.style.background = "#facc15"}
    onMouseLeave={e => e.currentTarget.style.background = "#eab308"}
  >
    {children}
  </button>
);

/* ── AUTH ── */
const AuthCard = ({ children, title, subtitle }) => (
  <div style={{ background: "#000", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px" }}>
    <div style={{ width: "100%", maxWidth: "420px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <Logo onClick={() => {}} size="md" />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{title}</h1>
        <p style={{ color: "#71717a", fontSize: "14px" }}>{subtitle}</p>
      </div>
      <div style={{ border: "1px solid rgba(202,138,4,0.18)", background: "#09090b", borderRadius: "16px", padding: "36px" }}>
        {children}
      </div>
    </div>
  </div>
);

const labelStyle = { color: "#71717a", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "6px" };

const Login = ({ setPage }) => (
  <AuthCard title="Espace Investisseur" subtitle="Accédez à votre tableau de bord privé">
    <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={(e) => e.preventDefault()}>
      <div><label style={labelStyle}>Email</label><InputField placeholder="votre@email.com" type="email" /></div>
      <div>
        <label style={labelStyle}>Mot de passe</label>
        <InputField placeholder="••••••••" type="password" />
      </div>
      <div style={{ textAlign: "right" }}>
        <button style={{ background: "none", border: "none", color: "#facc15", fontSize: "12px", cursor: "pointer" }}>Mot de passe oublié ?</button>
      </div>
      <button onClick={() => setPage("dashboard")} type="button" style={{
        background: "#eab308", color: "#000", border: "none", cursor: "pointer",
        fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase", padding: "14px", borderRadius: "8px", transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "#facc15"}
        onMouseLeave={e => e.currentTarget.style.background = "#eab308"}
      >
        Se Connecter
      </button>
      <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px", textAlign: "center" }}>
        <span style={{ color: "#71717a", fontSize: "13px" }}>Pas encore membre ? </span>
        <button onClick={() => setPage("signup")} style={{ background: "none", border: "none", color: "#facc15", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>S'inscrire</button>
      </div>
    </form>
  </AuthCard>
);

const Signup = ({ setPage }) => <SignupForm setPage={setPage} />;

/* ── DASHBOARD ── */
const Dashboard = ({ setPage }) => {
  const stats = [
    { label: "Opportunités Actives", value: "24", delta: "+3 ce mois" },
    { label: "Dossiers Consultés", value: "8", delta: "Ce mois" },
    { label: "Alertes Configurées", value: "5", delta: "Actives" },
    { label: "Off-Market Disponibles", value: "7", delta: "Accès Elite" },
  ];
  const recentActivity = [
    { type: "Nouveau listing", lieu: "Casablanca — 2 400 m²", time: "Il y a 2h", hot: true },
    { type: "Mise à jour prix", lieu: "Tanger Industrial Zone", time: "Il y a 5h", hot: false },
    { type: "Offre reçue", lieu: "Agadir Bord de mer", time: "Hier", hot: false },
    { type: "Dossier validé", lieu: "Marrakech — Resort 5*", time: "Il y a 2j", hot: false },
  ];

  return (
    <div style={{ background: "#09090b", color: "#fff", minHeight: "100vh" }}>
      <div style={{
        background: "#000", borderBottom: "1px solid #27272a",
        padding: "14px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40,
      }}>
        <Logo onClick={() => setPage("home")} size="sm" />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontSize: "11px", color: "#facc15", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", border: "1px solid rgba(234,179,8,0.25)",
            background: "rgba(234,179,8,0.08)", padding: "5px 14px", borderRadius: "999px",
          }}>Investisseur Elite</span>
          <button onClick={() => setPage("home")} style={{
            background: "none", border: "none", color: "#71717a", fontSize: "11px",
            fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#71717a"}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Tableau de Bord Privé</h1>
            <p style={{ color: "#71717a", fontSize: "14px" }}>Bienvenue, Mohammed — Votre accès Elite est actif.</p>
          </div>
          <button onClick={() => setPage("offmarket")} style={{
            background: "#eab308", color: "#000", border: "none", cursor: "pointer",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "12px 24px", borderRadius: "8px", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#facc15"}
            onMouseLeave={e => e.currentTarget.style.background = "#eab308"}
          >
            Voir Off-Market Elite
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {stats.map((s) => (
            <StatCard key={s.label} s={s} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }} className="stack-mobile">
          <div style={{ background: "#000", border: "1px solid #27272a", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              Activité Récente
              <span style={{ width: "7px", height: "7px", background: "#10b981", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            </h3>
            {recentActivity.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "14px 0",
                borderBottom: i < recentActivity.length - 1 ? "1px solid #111" : "none",
              }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: a.hot ? "#facc15" : "#3f3f46", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{a.type}</div>
                  <div style={{ fontSize: "12px", color: "#71717a" }}>{a.lieu}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#52525b", whiteSpace: "nowrap" }}>{a.time}</div>
                {a.hot && <Badge>Nouveau</Badge>}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#000", border: "1px solid #27272a", borderRadius: "12px", padding: "24px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#71717a", marginBottom: "16px" }}>Mon Profil</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  width: "44px", height: "44px", background: "rgba(234,179,8,0.15)",
                  border: "1px solid rgba(234,179,8,0.25)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" fill="none" stroke="#facc15" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: "15px" }}>Mohammed Alami</div>
                  <div style={{ color: "#71717a", fontSize: "12px" }}>Investisseur Elite</div>
                </div>
              </div>
              {[["Statut", "Elite"], ["Accès Off-Market", "Actif"], ["Alertes", "5 configurées"]].map(([k, v], i, arr) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #111" : "none",
                }}>
                  <span style={{ color: "#71717a", fontSize: "13px" }}>{k}</span>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: "13px" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(234,179,8,0.04)", border: "1px solid rgba(202,138,4,0.18)", borderRadius: "12px", padding: "20px" }}>
              <h4 style={{ color: "#facc15", fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>Conseiller Dédié</h4>
              <p style={{ color: "#71717a", fontSize: "12px", lineHeight: 1.6, marginBottom: "16px" }}>Votre conseiller Atlas Prime est disponible pour toute question.</p>
              <WhatsAppBtn message="Bonjour, je suis Mohammed Alami, investisseur Elite Atlas Prime. Je souhaite parler à mon conseiller." small />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ s }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#000", border: hover ? "1px solid rgba(202,138,4,0.3)" : "1px solid #27272a",
        borderRadius: "12px", padding: "24px", transition: "border 0.3s",
      }}
    >
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "32px", fontWeight: 700, color: "#facc15", marginBottom: "6px" }}>{s.value}</div>
      <div style={{ fontWeight: 600, color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{s.label}</div>
      <div style={{ color: "#52525b", fontSize: "11px" }}>{s.delta}</div>
    </div>
  );
};

/* ── FOOTER ── */
const Footer = ({ setPage }) => (
  <footer style={{ borderTop: "1px solid #27272a", background: "#09090b" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px", marginBottom: "48px" }} className="stack-mobile">
        <div>
          <div style={{ marginBottom: "16px" }}>
            <Logo onClick={() => setPage("home")} />
          </div>
          <p style={{ color: "#52525b", fontSize: "14px", lineHeight: 1.75, maxWidth: "300px", marginBottom: "24px" }}>
            La plateforme institutionnelle de référence pour l'investissement foncier stratégique au Maroc. Réseau privé, actifs d'exception.
          </p>
          <WhatsAppBtn message="Bonjour Atlas Prime Assets." small />
        </div>
        <div>
          <h4 style={{ color: "#71717a", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Plateforme</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[["marketplace", "Marketplace"], ["offmarket", "Off-Market Elite"], ["partenariats", "Partenariats"], ["signup", "Espace Investisseurs"]].map(([id, label]) => (
              <li key={id}>
                <button onClick={() => setPage(id)} style={{
                  background: "none", border: "none", color: "#52525b",
                  fontSize: "14px", cursor: "pointer", padding: 0, transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#facc15"}
                  onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ color: "#71717a", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Contact</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Casablanca, Maroc", "contact@atlasprimeassets.ma", "+212 6 00 00 00 00"].map((item) => (
              <li key={item} style={{ color: "#52525b", fontSize: "14px" }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #27272a", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ color: "#3f3f46", fontSize: "12px" }}>© 2025 Atlas Prime Assets. Tous droits réservés.</div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Confidentialité", "CGU", "Mentions légales"].map((l) => (
            <button key={l} style={{ background: "none", border: "none", color: "#3f3f46", fontSize: "12px", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#71717a"}
              onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}
            >{l}</button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ── APP ROOT ── */
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #000; color: #fff; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      ::placeholder { color: #3f3f46; }
      input, textarea, select { font-family: 'DM Sans', system-ui, sans-serif; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

      @media (max-width: 768px) {
        .hidden-mobile { display: none !important; }
        .show-mobile { display: flex !important; }
        .stack-mobile { grid-template-columns: 1fr !important; }
      }
      @media (min-width: 769px) {
        .show-mobile { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const showNav = !["login", "signup", "dashboard"].includes(page);

  const renderPage = () => {
    switch (page) {
      case "home": return <Home setPage={setPage} />;
      case "marketplace": return <Marketplace />;
      case "offmarket": return <OffMarket setPage={setPage} />;
      case "partenariats": return <Partenariats />;
      case "contact": return <Contact />;
      case "login": return <Login setPage={setPage} />;
      case "signup": return <Signup setPage={setPage} />;
      case "dashboard": return <Dashboard setPage={setPage} />;
      default: return <Home setPage={setPage} />;
    }
  };

  return (
    <>
      {showNav && <Nav page={page} setPage={setPage} />}
      {renderPage()}
    </>
  );
}