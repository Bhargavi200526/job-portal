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
exports.protectCompany = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Company_1 = __importDefault(require("../models/Company"));
const protectCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const cln = token.replace(/^'|'$/g, '');
            const decoded = jsonwebtoken_1.default.verify(cln, process.env.JWT_SECRET);
            // const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown as { id: string };
            const company = yield Company_1.default.findById(decoded.id).select('-password');
            if (!company) {
                res.status(401).json({ message: 'Company not found' });
                return;
            }
            req.company = company;
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
});
exports.protectCompany = protectCompany;
