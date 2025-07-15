"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Sentry = __importStar(require("@sentry/node"));
const Webhooks_1 = __importDefault(require("./controllers/Webhooks"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const db_1 = __importDefault(require("./config/db"));
const cloudinary_1 = require("./config/cloudinary");
const JobRoutes_1 = __importDefault(require("./routes/JobRoutes"));
const express_2 = require("@clerk/express");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Sentry (no handlers)
Sentry.init({
    dsn: process.env.SENTRY_DSN || 'https://your-dsn-url',
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    sendDefaultPii: true,
});
// Connect to MongoDB
(0, db_1.default)();
(0, cloudinary_1.connectCloudinary)();
// Create Express app
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://job-portal-server-lc8u.onrender.com",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
// Routes
app.get('/', (req, res) => {
    res.send('API is working!');
});
app.post('/webhooks', express_1.default.json({ type: '*/*' }), Webhooks_1.default);
app.use('/api/company', companyRoutes_1.default);
app.use('/api/jobs', JobRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
