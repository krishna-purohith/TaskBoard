import z, { ZodError } from "zod";

export function zodCustomErroFormat(error: ZodError) {
  return error.issues.map((i) => ({
    path: i.path[0],
    message: i.message,
  }));
}
