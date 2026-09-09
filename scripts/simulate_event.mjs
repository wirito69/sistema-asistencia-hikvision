// Script para simular una marcación con foto de cámara desde Hikvision
async function simulate() {
  const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPjfDwAE4wH5/yUfDgAAAABJRU5ErkJggg==";
  const imageBuffer = Buffer.from(sampleBase64, "base64");

  const formData = new FormData();
  formData.append("employeeNo", "1025");
  formData.append("name", "Carlos Mendoza");
  
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  formData.append("picture", blob, "capture_face.jpg");

  console.log("Enviando marcación simulada a http://localhost:8080/api/hikvision ...");
  try {
    const res = await fetch("http://localhost:8080/api/hikvision", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log("Respuesta del servidor:", result);
  } catch (err) {
    console.error("Error al conectar con el servidor local. Asegúrate de tener 'npm run dev' activo.", err.message);
  }
}

simulate();
