export default function AtlasPrime() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/0635421721', '_blank');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '40px' }}>
      <h1>🌟 Atlas Prime Assets</h1>
      <p>Votre plateforme d'investissement numéro 1</p>
      <button onClick={handleWhatsApp} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        💬 Nous contacter sur WhatsApp
      </button>
    </div>
  );
}