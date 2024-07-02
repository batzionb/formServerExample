"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require("cors");
const app = (0, express_1.default)();
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
app.use(body_parser_1.default.json());
app.post("/countries", (req, res) => {
    console.log(res);
    res.json({
        data: {
            countries: countries,
        },
    });
});
app.post("/cities", (req, res) => {
    // Mock response for cities based on country
    const { formData } = req.body;
    const countryCode = formData.country;
    const citiesByCountry = {
        ["United States"]: ["New York", "Los Angeles", "Chicago", "Houston"],
        ["Canada"]: ["Toronto", "Vancouver", "Montreal", "Calgary"],
        ["United Kingdom"]: ["London", "Manchester", "Birmingham", "Glasgow"],
        ["Australia"]: ["Sydney", "Melbourne", "Brisbane", "Perth"],
    };
    const cities = citiesByCountry[countryCode] || [];
    res.json({
        data: {
            cities: cities,
        },
    });
});
app.post("/validate-username", (req, res) => {
    // Mock response for username validation
    const username = req.body.value;
    const existingUsernames = ["john_doe", "jane_doe", "user123"];
    if (existingUsernames.includes(username)) {
        res.json({
            errorMsg: "Username is already taken",
        });
    }
    else {
        res.json({
            errorMsg: null,
        });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
