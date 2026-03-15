import express from "express";
import next from "next";
import { getRunnerState, runCommand } from "./commandRunner.js";

function parseBoolean(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }
  return !["false", "0", "no", "off"].includes(String(value).toLowerCase());
}

function sendJsonError(res, status, error, message, details) {
  return res.status(status).json({
    success: false,
    error,
    message,
    ...(details ? { details } : {}),
  });
}

const dev = parseBoolean(process.env.NEXT_DEV, true);
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 8080);
const runToken = process.env.RUN_TOKEN;

const nextApp = next({ dev, hostname: host, port });
const handle = nextApp.getRequestHandler();

async function start() {
  await nextApp.prepare();

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "256kb" }));

  app.get("/health", (_req, res) => {
    return res.status(200).json({
      ok: true,
      service: "next-express-unified",
      busy: getRunnerState().busy,
      timestamp: new Date().toISOString(),
      env: dev ? "development" : "production",
    });
  });

  app.post("/run", async (req, res) => {
    if (!runToken) {
      return sendJsonError(
        res,
        500,
        "AUTH_MISCONFIGURED",
        "RUN_TOKEN is not configured on the server"
      );
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendJsonError(
        res,
        401,
        "UNAUTHORIZED",
        "Missing Authorization header. Use Bearer <token>."
      );
    }

    const [scheme, token, extra] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token || extra) {
      return sendJsonError(
        res,
        401,
        "UNAUTHORIZED",
        "Malformed Authorization header. Expected Bearer <token>."
      );
    }

    if (token !== runToken) {
      return sendJsonError(res, 403, "FORBIDDEN", "Invalid bearer token");
    }

    try {
      const result = await runCommand(req.body, { timeoutMs: 60_000 });
      return res.status(200).json(result);
    } catch (error) {
      if (error?.code === "BUSY") {
        return sendJsonError(
          res,
          409,
          "RUNNER_BUSY",
          "Another command is already running"
        );
      }

      if (error instanceof Error) {
        const msg = error.message || "Unknown command runner error";
        const isInputError =
          msg.includes("payload") ||
          msg.includes("action") ||
          msg.includes("args") ||
          msg.includes("invalid command string");
        return sendJsonError(
          res,
          isInputError ? 400 : 500,
          isInputError ? "INVALID_PAYLOAD" : "RUNNER_FAILURE",
          msg
        );
      }

      return sendJsonError(
        res,
        500,
        "RUNNER_FAILURE",
        "Unknown command runner failure"
      );
    }
  });

  app.use((err, _req, res, next) => {
    if (err?.type === "entity.parse.failed") {
      return sendJsonError(
        res,
        400,
        "INVALID_PAYLOAD",
        "Request body must be valid JSON"
      );
    }
    return next(err);
  });

  app.all(/.*/, (req, res) => handle(req, res));

  app.listen(port, host, () => {
    console.log(
      `[server] listening on http://${host}:${port} (nextDev=${String(dev)})`
    );
  });
}

start().catch((error) => {
  console.error("[server] fatal startup error:", error);
  process.exit(1);
});
