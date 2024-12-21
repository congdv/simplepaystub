import z from "zod";
import { PayStubSchema } from "./schemas";

export type PayStubType = z.infer<typeof PayStubSchema>;
