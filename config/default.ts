import dotenv from 'dotenv';

dotenv.config();

export default {
  port: 5000,
  dbUri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rawtx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  env: "development"
};