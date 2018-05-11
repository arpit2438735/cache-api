# Cache API
REST API for cache API

## Requirements
- Mongo
- Node >= v8

## Running in dev environment
1. Clone the repo and cd into the folder.
    ```
    git clone git@github.com:arpit2438735/cache-api.git
    cd cache-api
    ```
2. Make a copy using
    ```
    cp .env.example .env
    ```

3. In your `.env` file, replace the env variable as described below:

    a. `PORT` available port to run the app from.

    b. `NODE_ENV` specify if development or production

    c. `MONGO_URI` URL of the database server.

    d. `MAX_CACHE_ENTRIES` Maximum number of entries that should be stored in the cache.

4. Install all npm dependencies
    ```
    npm install
    ```

5. Start the app
    ```
    npm start
    ```
