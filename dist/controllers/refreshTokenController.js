"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRefreshToken = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt = require('jsonwebtoken');
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.sendStatus(401);
        return;
    }
    console.log('kookies :', cookies);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    const foundUser = await User_1.default.findOne({ refreshToken: refreshToken }).exec();
    console.log('foundUser :', foundUser);
    if (!foundUser) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            console.log('Attempted refresh token reuse!');
            const hackedUser = await User_1.default.findOne({ username: decoded?.username }).exec();
            if (hackedUser) {
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
                console.log(result);
            }
        });
        res.sendStatus(403);
        return;
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.log('Expired refresh token');
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();
            console.log(result);
        }
        if (err || foundUser.username !== decoded?.username)
            return res.sendStatus(403);
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign({
            UserInfo: {
                username: decoded.username,
                roles: roles,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const newRefreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    });
};
exports.handleRefreshToken = handleRefreshToken;
exports.default = { handleRefreshToken: exports.handleRefreshToken };
//# sourceMappingURL=refreshTokenController.js.map