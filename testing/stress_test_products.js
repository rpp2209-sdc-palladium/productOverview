import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    stress: {
      //executor: "ramping-arrival-rate",
      executor: "constant-vus",
      //preAllocatedVUs: 1500,
      vus: 100,
      duration: "30s"
      // timeUnit: "1s",
      // stages: [
      //   { duration: "30s", target: 1 }, // below normal load
      //   { duration: "30s", target: 10 },
      //   { duration: "30s", target: 20 }, // normal load
      //   { duration: "30s", target: 30 },
      //   { duration: "30s", target: 60 },
      //   { duration: "30s", target: 100 }, // around the breaking point
      //   { duration: "30s", target: 500 },
      //   { duration: "30s", target: 1000 }, // beyond the breaking point
      //   { duration: "30s", target: 1200 },
      //   { duration: "30s", target: 1400 },
      //   { duration: "30s", target: 1500 }, // scale down. Recovery stage.
      // ],
    },
  },
};

export default function () {
  const BASE_URL = "http://localhost:3001"; // make sure this is not production
  const product_id = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
  http.get(`${BASE_URL}/products`);

  // const responses = http.batch([
  //   ["GET", `${BASE_URL}/products`],
  //   ["GET", `${BASE_URL}/products/${product_id}`],
  //   ["GET", `${BASE_URL}/products/${product_id}/styles`],
  //   ["GET", `${BASE_URL}/products/${product_id}/related`],
  // ]);
}

