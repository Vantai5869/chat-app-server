import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    // useUnifiedTopology: true,
    // useNewUrlParser: true,

    keepAlive: true,
    autoIndex: true, // Don't build indexes
    maxPoolSize: 500, // Maintain up to 500 socket connections
    serverSelectionTimeoutMS: 50000, // Keep trying to send operations for 50 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'taipv';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'mgtaipv00';
const MONGO_HOST = process.env.MONGO_URL || `hero.538dt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

const DOMAIN = process.env.DOMAIN || 'https://chat-app-server-hero.herokuapp.com';
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'tpv';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const CLOUDINARY = {
    CLOUDINARY_NAME:'dueyjeqd5',
    CLOUDINARY_KEY:'561595587471163',
    CLOUDINARY_SECRET:'78Uz9arowByOL-xM6lx57ng1oPI'
};

const config = {
    mongo: MONGO,
    server: SERVER,
    DOMAIN:DOMAIN,
    CLOUDINARY:CLOUDINARY,
};

export default config;
