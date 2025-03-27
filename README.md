# RSS Feed API


- Fetch and save the latest news from:
    - https://www.aps.dz/
    - http://www.alger-republicain.com/
- Filter news by category.


## Usage

### Base URL
```
http://localhost:5500/api/feeds
```

### Endpoints

1. **Get Latest Articles**
```
GET http://localhost:5500/api/feeds/latest
```

2. **Filter Articles by Category**
```
   GET http://localhost:5500/api/feeds/category/:category 
```
- Valid categories:
```
  `economy`, `politics`, `society`, `culture`, `regions`, `health`, `science`, `technology`, `sport`.
```
- Optional query parameters:
  - `page`: Page number (default: 1).
  - `limit`: Number of items per page (default: 50).

## Setup

1. Clone the repository:
 ```bash
 git clone https://github.com/mohyacineabed/algAPI.git
 cd algAPI
```
2. Install dependencies:
  ```bash
npm install
```
3. Create a .env file and add your MongoDB connection string: 
```
MONGODB_URI=your_mongodb_connection_string
UPDATE_INTERVAL=30 # Minutes
```
4. Start the server: 
```bash
npm start
```