import express from "npm:express@5.0.1";
import helmet from "npm:helmet@8.0.0";
import cors from "npm:cors@2.8.5";

import { controllers } from "./src/controller/mod.ts";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api", controllers);

const PORT = Deno.env.get("APP_PORT") || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server is running at http://localhost:${PORT}`);
});
