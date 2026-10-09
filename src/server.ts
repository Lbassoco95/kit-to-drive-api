import { crearApp } from "./app";
import { cargarConfig } from "./config";

const app = crearApp(cargarConfig());

if (!process.env.VERCEL) {
  const puerto = Number(process.env.PORT ?? 8787);
  app.listen(puerto, () => console.log(`kit-to-drive-api escuchando en :${puerto}`));
}

export default app;
