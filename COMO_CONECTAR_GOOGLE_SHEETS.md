# 📊 Guía Paso a Paso: Conectar el Formulario Web con vuestra Hoja de Google Sheets

Con este método gratuito (Google Apps Script), **todas las respuestas de vuestros invitados se guardarán automáticamente en una sola hoja de cálculo de Google Sheets en tiempo real.**

---

### Paso 1: Crear la Hoja de Google Sheets
1. Entrad en [Google Sheets](https://sheets.google.com) y cread una nueva hoja de cálculo llamada **"RSVP Boda Carlos y Andrea"**.
2. En la **primera fila (fila 1)**, poned estos encabezados exactos en las columnas:

| A | B | C | D | E | F | G | H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Fecha Registro** | **Nombre Completo** | **Asistencia** | **Acompañantes** | **Alergias / Menú** | **Autobús** | **Canción DJ** | **Notas** |

---

### Paso 2: Crear el Script Receptor (Google Apps Script)
1. En la misma hoja de Google Sheets, en el menú superior hace clic en **Extensiones** > **Apps Script**.
2. Borra el código que aparece por defecto y pega este código:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var fechaStr = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

    sheet.appendRow([
      data.timestamp || fechaStr,
      data.fullName || "",
      data.attendance || "",
      data.companions || "",
      data.dietary || "",
      data.busRequired || "",
      data.songRequest || "",
      data.notes || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Guarda el proyecto haciendo clic en el icono del **Disco (Guardar)** 💾.

---

### Paso 3: Publicar como Aplicación Web (Obtener la URL Webhook)

> 💡 **En tu pantalla:**
> - En la **esquina superior derecha** verás el botón azul que dice **`Implementar`** (junto al icono de la flechita hacia abajo `▼`).

1. En la esquina superior derecha, haz clic en el botón azul **`Implementar`**.
2. En el menú desplegable que se abre, selecciona la primera opción: **`Nuevo despliegue`**.
3. En la ventana emergente que aparece:
   - Haz clic en el icono del **Engranaje ⚙️** (junto a "Seleccionar tipo").
   - Elige **`Aplicación Web`**.
4. Configura estos 3 campos:
   * **Descripción:** `RSVP Webhook Boda`
   * **Ejecutar como:** `Yo` (`tu-correo@gmail.com`)
   * **Quién tiene acceso:** **`Cualquier persona`**  
     *(¡Muy importante! Selecciona "Cualquier persona" para que tus invitados puedan responder desde su móvil sin necesidad de iniciar sesión).*
5. Haz clic en el botón azul **`Implementar`**.
6. Google te pedirá **"Autorizar acceso"**:
   - Haz clic en *Autorizar acceso*.
   - Elige tu cuenta de Google.
   - Si te aparece una pantalla de advertencia ("Google no ha verificado esta aplicación"), haz clic en **Configuración avanzada** (abajo a la izquierda) y luego en **Ir a Proyecto sin título (no seguro)**. ¡Es totalmente seguro porque es vuestro propio script!
   - Pulsa **Permitir**.
7. Al finalizar, verás una pantalla con la **URL de la aplicación web** (un enlace largo que empieza por `https://script.google.com/macros/s/...`). ¡Copia esa URL!

---

### Paso 4: Conectar la URL en vuestra Invitación
1. Abre el archivo `rsvp_config.js` dentro de la carpeta `invitacion`.
2. Pega tu URL en la variable `webhookUrl`:

```javascript
  rsvp: {
    webhookUrl: "TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI",
    saveToLocalStorage: true
  }
```

¡Y listo! Cada vez que un invitado rellene la invitación, la respuesta aparecerá instantáneamente en vuestra hoja de Google Sheets.
