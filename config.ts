import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define interface for request options
interface RequestOptions {
  method: string;
  url: string;
  params: { s: string };
  headers: {
    'x-rapidapi-host': string;
    'x-rapidapi-key': string;
  };
}

// Retrieve API key from environment variables
const apiKey = process.env.RAPIDAPI_KEY;

// Create request options
const options: RequestOptions = {
  method: 'GET',
  url: 'https://the-cocktail-db.p.rapidapi.com/search.php',
  params: { s: 'vodka' },
  headers: {
    'x-rapidapi-host': 'the-cocktail-db.p.rapidapi.com',
    'x-rapidapi-key': apiKey!
  }
};