"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svix_1 = require("svix");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const webhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        res.status(500).json({ message: "Webhook secret not configured" });
        return;
    }
    const svix = new svix_1.Webhook(WEBHOOK_SECRET);
    const headers = {
        'svix-id': req.headers['svix-id'],
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature'],
    };
    let event;
    try {
        const payload = yield svix.verify(JSON.stringify(req.body), headers);
        event = payload;
    }
    catch (err) {
        console.error('Webhook verification failed:', err);
        res.status(400).json({ message: 'Invalid webhook signature' });
        return;
    }
    const eventType = event.type;
    const data = event.data;
    try {
        switch (eventType) {
            case 'user.created': {
                const { id, email_addresses, first_name, last_name, image_url, public_metadata } = data;
                yield User_1.default.create({
                    id,
                    email: ((_a = email_addresses[0]) === null || _a === void 0 ? void 0 : _a.email_address) || '',
                    name: `${first_name} ${last_name}`,
                    image: image_url,
                    resume: (public_metadata === null || public_metadata === void 0 ? void 0 : public_metadata.resume) || '',
                });
                res.status(201).json({ message: 'User created successfully' });
                return;
            }
            case 'user.updated': {
                const { id, email_addresses, first_name, last_name, image_url } = data;
                yield User_1.default.findOneAndUpdate({ id }, {
                    email: ((_b = email_addresses[0]) === null || _b === void 0 ? void 0 : _b.email_address) || '',
                    name: `${first_name} ${last_name}`,
                    image: image_url,
                }, { new: true });
                res.status(200).json({ message: 'User updated successfully' });
                return;
            }
            case 'user.deleted': {
                const { id } = data;
                yield User_1.default.findOneAndDelete({ id });
                res.status(200).json({ message: 'User deleted successfully' });
                return;
            }
            default:
                res.status(200).json({ message: 'Unhandled event type' });
                return;
        }
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.default = webhookHandler;
