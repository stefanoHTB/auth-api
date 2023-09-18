import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Assuming you have a User model defined
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


export const handleLogin = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

    const foundUser: IUser | null = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      // Create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '50s' }
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d' }
      );

      let newRefreshTokenArray =
        !cookies?.jwt
          ? foundUser.refreshToken
          : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
          console.log('attempted refresh token reuse at login!');
          // Clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
      }

      // Saving refreshToken with the current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      console.log(result);
      console.log(roles);

      // Creates a Secure Cookie with the refresh token
      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

      // Send authorization roles and access token to the user
      // res.json({ roles, accessToken });
      res.json({ accessToken });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { handleLogin };
