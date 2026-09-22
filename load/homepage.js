import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:3000";

const errorRate = new Rate("errors");
const homeDuration = new Trend("home_duration");

export const options = {
  scenarios: {
    smoke: {
      executor: "constant-vus",
      vus: 5,
      duration: "20s",
      startTime: "0s",
      tags: { scenario: "smoke" },
    },
    load: {
      executor: "ramping-vus",
      startTime: "20s",
      startVUs: 0,
      stages: [
        { duration: "15s", target: 20 },
        { duration: "30s", target: 20 },
        { duration: "10s", target: 0 },
      ],
      tags: { scenario: "load" },
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800", "p(99)<1500"],
    home_duration: ["p(95)<800"],
    errors: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  group("homepage", () => {
    const res = http.get(`${BASE_URL}/`, {
      headers: { Accept: "text/html" },
      tags: { name: "GET /" },
    });

    homeDuration.add(res.timings.duration);

    const ok = check(res, {
      "status is 200": (r) => r.status === 200,
      "body is not empty": (r) => (r.body || "").length > 0,
      "content-type is html": (r) =>
        String(r.headers["Content-Type"] || "").includes("text/html"),
    });

    errorRate.add(!ok);
  });

  sleep(1);
}
