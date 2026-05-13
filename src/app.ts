import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { bookingsRoutes } from "./modules/bookings/http/bookings.routes";


export const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "booking-api-redis",
  });
});

app.use("/bookings", bookingsRoutes);