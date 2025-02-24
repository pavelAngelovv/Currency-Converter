# Currency-Converter

A simple React app for real-time currency conversion. Users can add/remove currencies and perform live conversions based on real-time exchange rates.

## Features
- Convert between multiple currencies.
- Add or remove currencies from the conversion list.
- Persistent data using `localStorage`.
- Responsive UI built with **Material-UI**.

## Tech Stack
- **Frontend:** React, Material-UI, Typescript
- **API:** Axios
- **Database:** MongoDB
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Local Storage:** For persistent data

## Installation and running locally

1. Clone the repo:
   
   `git clone https://github.com/pavelAngelovv/Currency-Converter.git`

2. Install dependencies on frontend and backend
    `cd backend`
    `npm install`

    `cd frontend`
    `npm install`

3. **Set up environment variables:**
   Ensure the `.env` files are configured for both backend and frontend.

   - **Backend (.env) configuration:**
     - Set `MONGODB_URI` for MongoDB connection.
     - Set any API keys for external services.
       (For this project i used `https://api.exchangerate-api.com/v4/latest/USD`)
     - Specify `PORT`.

   - **Frontend (.env) configuration:**
     - Set `REACT_APP_API_URL` to point to your backend URL for API calls.

4. Start backend and frontend

    - **Backend: `npm start`**
    - **Frontend: `npm run dev`**

    ## Demo
    https://currency-conversion-tool.netlify.app/

     # P.S.
     (Load times may be slow as it is hosted for free)
