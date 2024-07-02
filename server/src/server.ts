import express from "express";
import path from "path";
import bodyParser from "body-parser";
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000; // Use process.env.PORT or default to 4000

// Serve static files from the 'client/dist' directory
const corsOptions = {
  origin: "http://localhost:5173",
};
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
];
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/countries", (req, res) => {
  console.log(res);
  res.json({
    data: {
      countries: countries,
    },
  });
});

app.post(
  "/cities",
  (
    req: { body: { formData: any } },
    res: { json: (arg0: { data: { cities: string[] } }) => void }
  ) => {
    // Mock response for cities based on country
    const { formData } = req.body;
    const countryCode = formData.country;
    console.log({ countryCode });
    const citiesByCountry: { [key: string]: string[] } = {
      ["United States"]: ["New York", "Los Angeles", "Chicago", "Houston"],
      ["Canada"]: ["Toronto", "Vancouver", "Montreal", "Calgary"],
      ["United Kingdom"]: ["London", "Manchester", "Birmingham", "Glasgow"],
      ["Australia"]: ["Sydney", "Melbourne", "Brisbane", "Perth"],
    };

    const cities = citiesByCountry[countryCode] || [];
    console.log("cities", cities);
    res.json({
      data: {
        cities: cities,
      },
    });
  }
);

app.post("/api/validate/username", (req, res) => {
  // Mock response for username validation
  const { username } = req.body;
  const existingUsernames = ["john_doe", "jane_doe", "user123"];

  if (existingUsernames.includes(username)) {
    res.json({
      valid: false,
      message: "Username is already taken",
    });
  } else {
    res.json({
      valid: true,
      message: "Username is available",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
