
import { signAccessToken } from "../utils/jwt.js";
import axios from "axios";
import User from "@shared/models/User.js";

// Google OAuth
export const loginWithGoogle = async (code) => {
  // Exchange code for tokens
  const { data } = await axios.post(`https://oauth2.googleapis.com/token`, {
    code,
    client_id: config.GOOGLE_CLIENT_ID,
    client_secret: config.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:5000/auth/callback/google",
    grant_type: "authorization_code",
  });

  const { access_token } = data;

  const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  let user = await User.findOne({ email: userInfo.data.email });
  if (!user) {
    user = await User
    .create({
      email: userInfo.data.email,
      oauth: { googleId: userInfo.data.id, profilePic: userInfo.data.picture },
    });
  }
  const token = signAccessToken(user);
  return { user, token };
};

// GitHub OAuth
export const loginWithGithub = async (code) => {
  const { data } = await axios.post(`https://github.com/login/oauth/access_token`, {
    client_id: config.GITHUB_CLIENT_ID,
    client_secret: config.GITHUB_CLIENT_SECRET,
    code,
  }, { headers: { Accept: "application/json" } });

  const { access_token } = data;
  const userInfo = await axios.get(`https://api.github.com/user`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  let user = await User.findOne({ githubId: userInfo.data.id });
  if (!user) {
    user = await User.create({
      email: userInfo.data.email || `${userInfo.data.login}@github.com`,
      oauth: { githubId: userInfo.data.id, profilePic: userInfo.data.avatar_url },
    });
  }
  const token = signAccessToken(user);
  return { user, token };
};
