// Configuración de la Boda de Carlos & Andrea
const WEDDING_CONFIG = {
  couple: {
    groom: "Carlos Gómez Lázaro",
    bride: "Andrea De Sousa Cubero",
    shortNames: "Carlos & Andrea"
  },
  date: {
    iso: "2027-09-04T18:00:00", // 4 de Septiembre de 2027
    display: "Sábado, 4 de Septiembre de 2027",
    season: "Septiembre 2027"
  },
  locations: {
    celebration: {
      title: "Ceremonia Civil & Celebración",
      place: "NÜA (Carlos Maldonado)",
      address: "Av. de Miramar, 1, Urb. Serranillos Playa (Embalse de Cazalegas / San Román de los Montes, Toledo)",
      googleMapsUrl: "https://maps.google.com/?q=Nua+Eventos+Av+de+Miramar+1+Serranillos+Playa",
      time: "18:00 h"
    }
  },
  // Configuración de recepción de datos RSVP (Google Sheets / Formspree / Webhook API)
  rsvp: {
    // URL de Google Apps Script proporcionado por el usuario
    webhookUrl: "https://script.google.com/macros/s/AKfycbwiuxQdcKIj3S_WSDrC_-eewOZLEIHhSvuCy7huTbvnl3FIlmG8K6s4Phy7BLsVJ-Hk/exec", 
    
    // Almacenamiento secundario local para pruebas inmediatas en el navegador
    saveToLocalStorage: true
  }
};

if (typeof module !== 'undefined') {
  module.exports = WEDDING_CONFIG;
}
