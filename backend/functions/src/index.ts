'use strict';
const functions = require('firebase-functions');
const cryptoModule = require('crypto');
const openAiModule = require('openai');
const openAI = new openAiModule({
    apiKey: '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'
});
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const axios = require('axios');

const TWITTER_API_URL = 'https://api.x.com/oauth/request_token';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.x.com/oauth/access_token';
const CONSUMER_KEY = 'qaakmNtWg1rn0mStYPie3cQLQ';
const CONSUMER_SECRET = 'AA1osXWYJ5Q7NWXFbcBqU2LP9GdsEsDdXTzDx51Y4DbMDxcl3j';
// const CALLBACK = 'http://127.0.0.1:5173/dashboard';
// const CALLBACK = 'http://localhost:5173/dashboard';
const CALLBACK = 'https://social-sync-c8bd0.web.app/dashboard';
const INSTA_APP_ID = '1524681702259855';
const INSTA_APP_SECRET = 'c3b26e81a671b8442bd69445d5657c84';
const INSTA_CALLBACK = 'http://localhost:5173/dashboard';
const FACEBOOK_APP_ID = '607794918350455';
const FACEBOOK_APP_SECRET = '4c4cecbbfc60248c57690a0205da4025';
const FACEBOOK_REDIRECT = 'https://us-central1-social-sync-c8bd0.cloudfunctions.net/facebookCallback';

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: 'http://127.0.0.1:5001/social-sync-c8bd0/us-central1/facebookCallback',
            profileFields: ['id', 'displayName', 'email']
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
            done(null, { profile, accessToken });
        }
    )
);

exports.getTwitterRequestToken = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    try {
        // Prepare OAuth headers
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

        // Generate the OAuth signature base string
        const parameterString = Object.keys(oauthHeaders)
            .sort()
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(oauthHeaders[key])}`)
            .join('&');

        const baseString = `POST&${encodeURIComponent(TWITTER_API_URL)}&${encodeURIComponent(parameterString)}`;
        const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;
        const signature = cryptoModule.createHmac('sha1', signingKey).update(baseString).digest('base64');

        oauthHeaders['oauth_signature'] = signature;

        // Convert headers to an OAuth header string
        const authHeader = `OAuth ${Object.keys(oauthHeaders)
            .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(oauthHeaders[key])}"`)
            .join(', ')}`;

        // Make the request to Twitter's request_token API
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

exports.getTwitterAccessToken = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    try {
        const { oauth_token, oauth_verifier } = req.query;

        if (!oauth_token || !oauth_verifier) {
            res.status(400).send('Missing oauth_token or oauth_verifier');
            return;
        }

        // Generate OAuth headers
        const oauthNonce = Math.floor(Math.random() * 1e12).toString();
        const oauthTimestamp = Math.floor(Date.now() / 1000).toString();

        const oauthParams: any = {
            oauth_consumer_key: CONSUMER_KEY,
            oauth_nonce: oauthNonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: oauthTimestamp,
            oauth_token: oauth_token,
            oauth_version: '1.0'
        };

        // Create the parameter string
        const parameterString = Object.keys(oauthParams)
            .sort()
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
            .join('&');

        // Create the signature base string
        const baseString = `POST&${encodeURIComponent(TWITTER_ACCESS_TOKEN_URL)}&${encodeURIComponent(
            parameterString
        )}&oauth_verifier=${oauth_verifier}`;

        // Create the signing key
        const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;

        // Generate the OAuth signature
        const signature = cryptoModule.createHmac('sha1', signingKey).update(baseString).digest('base64');

        // Add signature to OAuth headers
        const authHeader = `OAuth oauth_consumer_key="${CONSUMER_KEY}", oauth_nonce="${oauthNonce}", oauth_signature="${encodeURIComponent(
            signature
        )}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauthTimestamp}", oauth_token="${oauth_token}", oauth_version="1.0"`;

        // Request access token
        const response = await fetch('https://api.x.com/oauth/access_token', {
            method: 'POST',
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `oauth_verifier=${oauth_verifier}`
        });

        if (!response.ok) {
            console.error('Error fetching access token:', response.statusText);
            res.status(response.status).send('Error fetching access token');
            return;
        }

        // Parse the response
        const data = await response.text();
        const queryParams = new URLSearchParams(data);
        const accessToken = queryParams.get('oauth_token');
        const accessTokenSecret = queryParams.get('oauth_token_secret');

        // Send the tokens back to the client
        res.send({ accessToken, accessTokenSecret });
    } catch (error) {
        console.error('Error in getTwitterAccessToken function:', error);
        res.status(500).send('Internal Server Error');
    }
});

exports.chatMessage = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    try {
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

const generateOAuthHeader = (url: any, method: any, params: any, tokenSecret: any) => {
    const oauthNonce = Math.floor(Math.random() * 1e12).toString();
    const oauthTimestamp = Math.floor(Date.now() / 1000).toString();

    const oauthParams = {
        oauth_consumer_key: CONSUMER_KEY,
        oauth_nonce: oauthNonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: oauthTimestamp,
        oauth_token: params.oauth_token,
        oauth_version: '1.0'
    };

    const allParams = { ...oauthParams, ...params.query };
    const parameterString = Object.keys(allParams)
        .sort()
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
        .join('&');

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(parameterString)}`;
    const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&${encodeURIComponent(tokenSecret)}`;

    const oauthSignature = cryptoModule.createHmac('sha1', signingKey).update(baseString).digest('base64');

    return `OAuth ${Object.entries({
        ...oauthParams,
        oauth_signature: oauthSignature
    })
        .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
        .join(', ')}`;
};

const fetchTweetsByUserId = async (userId: any, accessToken: any, accessTokenSecret: any) => {
    const url = `https://api.twitter.com/2/users/${userId}/tweets`;
    const method = 'GET';
    const queryParams: any = {
        max_results: 20,
        'tweet.fields': 'id,text,created_at,public_metrics,non_public_metrics'
    };

    const oauthHeader = generateOAuthHeader(
        url,
        method,
        { oauth_token: accessToken, query: queryParams },
        accessTokenSecret
    );

    try {
        const response = await fetch(`${url}?${new URLSearchParams(queryParams)}`, {
            method,
            headers: {
                Authorization: oauthHeader
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch tweets: ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error fetching tweets:', error.message);
        throw error;
    }
};

exports.fetchTweets = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { accessToken, accessTokenSecret, userId } = req.body;
    try {
        const tweetsResponse = await fetchTweetsByUserId(userId, accessToken, accessTokenSecret);
        const tweets = tweetsResponse.data || [];
        console.log(`Fetched ${tweets.length} tweets:`);
        res.send(tweets);
    } catch (error: any) {
        console.error('Error:', error.message);
    }
});

exports.fetchTwitterUser = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { accessToken, accessTokenSecret } = req.body;
    const url = 'https://api.twitter.com/2/users/me';
    const method = 'GET';
    const oauthHeader = generateOAuthHeader(url, method, { oauth_token: accessToken }, accessTokenSecret);

    try {
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: oauthHeader
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch user details: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const queryParams = new URLSearchParams(data.data);
        const username = queryParams.get('username');
        const name = queryParams.get('name');
        const id = queryParams.get('id');

        res.send({ username, name, id });
    } catch (error: any) {
        console.error('Error fetching user details:', error.message);
        throw error;
    }
});

exports.fetchTwitterProfile = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { accessToken, accessTokenSecret } = req.body;
    const url = 'https://api.twitter.com/2/users/me';
    const method = 'GET';

    const queryParams = {
        'user.fields': 'public_metrics'
    };

    const oauthHeader = generateOAuthHeader(
        url,
        method,
        { oauth_token: accessToken, query: queryParams },
        accessTokenSecret
    );
    try {
        const response = await fetch(`${url}?${new URLSearchParams(queryParams)}`, {
            method,
            headers: {
                Authorization: oauthHeader,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch user details: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const { username, name, id, public_metrics } = data.data;

        console.log(`Username: ${username}, Name: ${name}, ID: ${id}`);
        console.log('Public Metrics:', public_metrics);

        res.send({ username, name, id, public_metrics });
    } catch (error: any) {
        console.error('Error fetching user details:', error.message);
        throw error;
    }
});

const postTweet = async (accessToken: string, accessTokenSecret: string, tweetContent: string) => {
    const url = 'https://api.x.com/2/tweets';
    const method = 'POST';

    // Define the tweet content
    const body = JSON.stringify({ text: tweetContent });

    // Prepare OAuth headers
    const queryParams = {
        oauth_token: accessToken,
        query: {}
    };

    const oauthHeader = generateOAuthHeader(url, method, queryParams, accessTokenSecret);

    try {
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: oauthHeader,
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to post tweet: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Tweet posted successfully:', data);
        return data;
    } catch (error: any) {
        console.error('Error posting tweet:', error.message);
        throw error;
    }
};

exports.createTwitterPost = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { accessToken, accessTokenSecret, content } = req.body;
    try {
        const response = await postTweet(accessToken, accessTokenSecret, content);
        const { id, text } = response.data;

        res.send({ id, text });
    } catch (error: any) {
        console.error('Error:', error.message);
    }
});

const deleteTweet = async (accessToken: string, accessTokenSecret: string, tweetId: string) => {
    const url = `https://api.twitter.com/2/tweets/${tweetId}`;
    const method = 'DELETE';

    const queryParams = {
        oauth_token: accessToken,
        query: {}
    };

    const oauthHeader = generateOAuthHeader(url, method, queryParams, accessTokenSecret);

    try {
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: oauthHeader
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to delete tweet: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Tweet deleted successfully:', data);
        return data;
    } catch (error: any) {
        console.error('Error deleting tweet:', error.message);
        throw error;
    }
};

exports.deleteTwitterPost = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { accessToken, accessTokenSecret, tweetId } = req.body;
    try {
        const response = await deleteTweet(accessToken, accessTokenSecret, tweetId);
        const { deleted } = response.data;

        res.send({ deleted });
    } catch (error: any) {
        console.error('Error:', error.message);
    }
});

exports.getInstaAccessToken = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { code } = req.body;
    const tokenUrl = `https://graph.facebook.com/v17.0/oauth/access_token`;

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: INSTA_APP_ID,
                client_secret: INSTA_APP_SECRET,
                redirect_uri: INSTA_CALLBACK,
                code
            })
        });
        const token_data = await response.json();

        const result = await fetch('https://graph.facebook.com/v17.0/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'fb_exchange_token',
                client_id: INSTA_APP_ID,
                client_secret: INSTA_APP_SECRET,
                fb_exchange_token: token_data.access_token
            })
        });

        const data = await result.json();
        console.log('Long lived token fetched->', data);
        res.json(data); // Returns access token
    } catch (error) {
        res.status(500).json({ error: 'Failed to exchange code for access token.' });
    }
});

exports.fetchInstaProfile = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { token } = req.body;
    const profileUrl = `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${token}`;

    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('API Error:', errorDetails);
            return res.status(response.status).json({ error: errorDetails });
        }
        const data = await response.json();
        res.json(data); // Successfully return user profile
    } catch (error) {
        console.log('fetchInstaProfile error', error);
        res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
});

exports.facebookAuth = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT}&scope=user_posts,user_friends,user_birthday,user_likes,public_profile`;
    res.redirect(facebookAuthUrl);
});

exports.facebookCallback = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { code } = req.query;

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.get('https://graph.facebook.com/v17.0/oauth/access_token', {
            params: {
                client_id: FACEBOOK_APP_ID,
                client_secret: FACEBOOK_APP_SECRET,
                redirect_uri: FACEBOOK_REDIRECT,
                code
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const response = await axios.get('https://graph.facebook.com/v17.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: FACEBOOK_APP_ID,
                client_secret: FACEBOOK_APP_SECRET,
                fb_exchange_token: accessToken
            }
        });

        const longLivedToken = response.data.access_token;

        // Redirect back to your frontend with the access token
        res.redirect(`https://social-sync-c8bd0.web.app/dashboard?fbaccessToken=${longLivedToken}`);
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Authentication failed.');
    }
});

exports.facebookProfile = functions.https.onRequest({ cors: true }, async (req: any, res: any) => {
    const { accessToken } = req.body;

    try {
        const response = await axios.get('https://graph.facebook.com/v17.0/me', {
            params: {
                fields: 'id,name,email,picture,friends,likes,birthday', // Specify fields to fetch
                access_token: accessToken // Access token
            }
        });

        const posts = await axios.get(
            `https://graph.facebook.com/v17.0/me/posts?access_token=${accessToken}&fields=id,message,created_time,attachments{media,type},comments.summary(true),reactions.summary(total_count),shares&limit=10`
        );

        // Return the profile data
        res.send({ ...response.data, posts: posts.data });
    } catch (error: any) {
        console.error('Error fetching Facebook profile:', error.response?.data || error.message);
        throw new Error('Failed to fetch Facebook profile');
    }
});
