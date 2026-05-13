import { Router } from "express";

import { DrizzlePropertyRepository } from "../infra/drizzle-property.repository";
import { CreatePropertyUseCase } from "../application/usecases/create-property.usecase";
import { GetPropertyByIdUseCase } from "../application/usecases/get-property-by-id.usecase";
import { ListPropertiesUseCase } from "../application/usecases/list-properties.usecase";
import { UpdatePropertyUseCase } from "../application/usecases/update-property.usecase";
import { DeletePropertyUseCase } from "../application/usecases/delete-property.usecase";
import { DrizzleBookingRepository } from "../../bookings/infra/drizzle-booking.repository";
import { RedisAvailabilityCache } from "../../bookings/infra/redis-availability-cache";
import { GetAvailabilityUseCase } from "../../bookings/application/usecases/get-availability.usecase";
import { PropertiesController } from "./property.controller";

const router = Router();

const propertyRepository = new DrizzlePropertyRepository();
const bookingRepository = new DrizzleBookingRepository();
const availabilityCache = new RedisAvailabilityCache();

const createPropertyUseCase = new CreatePropertyUseCase(propertyRepository);
const getPropertyByIdUseCase = new GetPropertyByIdUseCase(propertyRepository);
const listPropertiesUseCase = new ListPropertiesUseCase(propertyRepository);
const updatePropertyUseCase = new UpdatePropertyUseCase(propertyRepository);
const deletePropertyUseCase = new DeletePropertyUseCase(propertyRepository);
const getAvailabilityUseCase = new GetAvailabilityUseCase(
  bookingRepository,
  availabilityCache
);

const controller = new PropertiesController(
  createPropertyUseCase,
  getPropertyByIdUseCase,
  listPropertiesUseCase,
  updatePropertyUseCase,
  deletePropertyUseCase,
  getAvailabilityUseCase
);

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:propertyId/availability", controller.getAvailability);
router.get("/:id", controller.findById);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export { router as propertiesRoutes };
