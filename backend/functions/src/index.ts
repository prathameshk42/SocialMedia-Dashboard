'use strict';
import * as functions from 'firebase-functions';
import * as crypto from 'crypto';
import * as openAiModule from 'openai';
import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import * as bodyParser from 'body-parser';
import axios from 'axios';
import fetch from 'node-fetch'; // Ensure you install node-fetch for API requests

// Secure API Keys (Replace with your actual keys)
const openAI = new openAiModule({
    apiKey: "YOUR_OPENAI_API_KEY_HERE"
});

const TWITTER_API_URL = 'https://api.x.com/oauth/request_token';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.x.com/oauth/access_token';
const CONSUMER_KEY = "YOUR_TWITTER_CONSUMER_KEY_HERE";
const CONSUMER_SECRET = "YOUR_TWITTER_CONSUMER_SECRET_HERE";

const CALLBACK = "YOUR_CALLBACK_URL_HERE";
const INSTA_APP_ID = "YOUR_INSTAGRAM_APP_ID_HERE";
const INSTA_APP_SECRET = "YOUR_INSTAGRAM_APP_SECRET_HERE";
const INSTA_CALLBACK = "YOUR_INSTAGRAM_CALLBACK_URL_HERE";
const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID_HERE";
const FACEBOOK_APP_SECRET = "YOUR_FACEBOOK_APP_SECRET_HERE";
const FACEBOOK_REDIRECT = "YOUR_FACEBOOK_CALLBACK_URL_HERE";

// Setup Facebook Authentication
passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: FACEBOOK_REDIRECT,
            profileFields: ['id', 'displayName', 'email']
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
            done(null, { profile, accessToken });
        }
    )
);

// Twitter Authentication Functions
exports.getTwitterRequestToken = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    try {
        if (!CONSUMER_KEY || !CONSUMER_SECRET) {
            return res.status(500).json({ error: 'Twitter API keys are missing. Please add them.' });
        }

        const oauthNonce = Math.floor(Math.random() * 1e12).toString();
        const oauthTimestamp = Math.floor(Date.now() / 1000).toString();

        const oauthHeaders: any = {
            oauth_consumer_key: CONSUMER_KEY,
            oauth_nonce: oauthNonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: oauthTimestamp,
            oauth_version: '1.0',
            oauth_callback: CALLBACK
        };

        const parameterString = Object.keys(oauthHeaders)
            .sort()
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(oauthHeaders[key])}`)
            .join('&');

        const baseString = `POST&${encodeURIComponent(TWITTER_API_URL)}&${encodeURIComponent(parameterString)}`;
        const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;
        const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');

        oauthHeaders['oauth_signature'] = signature;

        const authHeader = `OAuth ${Object.keys(oauthHeaders)
            .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(oauthHeaders[key])}"`)
            .join(', ')}`;

        const response = await fetch(TWITTER_API_URL, {
            method: 'POST',
            headers: {
                Authorization: authHeader
            }
        });

        const data = await response.text();
        if (!response.ok) {
            console.error('Error:', response.status, response.statusText, data);
            return res.status(500).send({ error: 'Failed to get Twitter request token' });
        }

        const queryParams = new URLSearchParams(data);
        const authToken = queryParams.get('oauth_token');
        const authSecret = queryParams.get('oauth_token_secret');

        res.send({ authToken, authSecret });
    } catch (error) {
        console.error('Error fetching request token:', error);
        res.status(500).send({ error: 'Error fetching request token from Twitter API' });
    }
});

// OpenAI Chat Function
exports.chatMessage = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    try {
        if (openAI.apiKey === "YOUR_OPENAI_API_KEY_HERE") {
            return res.status(500).json({ error: 'OpenAI API key is missing. Please add it.' });
        }

        const { messages } = req.body;
        const finalMessages = messages.map((message: any) => {
            return { role: message.role, content: message.content };
        });

        const completion = await openAI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: finalMessages
        });

        res.send(completion.choices[0].message);
    } catch (error) {
        console.error('Error in sending chat message function:', error);
        res.status(500).send('Internal Server Error');
    }
});
