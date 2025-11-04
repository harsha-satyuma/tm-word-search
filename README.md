# Word Search Puzzle Application

A full-stack word search puzzle game with player tracking, admin management, and leaderboard functionality.

## Features

### Player Features
- **One-time Play**: Each employee can play only once using their unique Employee ID
- **Player Registration**: Players must provide their name and Employee ID before starting
- **Timed Gameplay**: 3-minute countdown timer for completing the puzzle
- **Word Finding**: Interactive grid to search and mark words
- **Real-time Feedback**: Track found words and remaining time
- **Results Display**: See completion time and words found after finishing
- **Automatic Submission**: Results are automatically saved to the leaderboard

### Admin Features
- **Secure Login**: Admin authentication system
- **Word Management**: Add, edit, and delete words for puzzles
- **Leaderboard Access**: View all player results and rankings
- **Performance Tracking**: See who completed first with detailed metrics

### Technical Features
- SQLite database for persistent storage
- RESTful API for all operations
- Real-time timer with proper state management
- Responsive UI with Tailwind CSS
- Type-safe with TypeScript

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Install Dependencies**
   ```bash
   cd CrosswordBuilder
   npm install
   ```

2. **Initialize Database**
   ```bash
   npm run db:push
   ```

3. **Seed Admin Users**
   ```bash
   npm run db:seed
   ```
   
   This creates default admin accounts:
   - Username: `admin`, Password: `admin123`
   - Username: `superadmin`, Password: `super123`
   
   ⚠️ **Important**: Change these passwords in production!

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Game: http://localhost:5000
   - Admin Login: http://localhost:5000/admin/login
   - Admin Panel: http://localhost:5000/admin (requires login)

## Database Schema

### Tables

#### `admins`
- `id` (INTEGER, Primary Key)
- `username` (TEXT, Unique)
- `password` (TEXT, Hashed)
- `created_at` (TIMESTAMP)

#### `players`
- `id` (INTEGER, Primary Key)
- `employee_id` (TEXT, Unique)
- `name` (TEXT)
- `created_at` (TIMESTAMP)

#### `game_results`
- `id` (INTEGER, Primary Key)
- `player_id` (INTEGER, Foreign Key → players.id)
- `time_taken` (INTEGER, seconds)
- `words_found` (INTEGER)
- `total_words` (INTEGER)
- `completed` (BOOLEAN)
- `completed_at` (TIMESTAMP)

## API Endpoints

### Player Endpoints

#### Register Player
```http
POST /api/players/register
Content-Type: application/json

{
  "name": "John Doe",
  "employeeId": "EMP001"
}
```

**Response:**
```json
{
  "player": {
    "id": 1,
    "employeeId": "EMP001",
    "name": "John Doe"
  }
}
```

**Error (409):** Player already completed the game

#### Check Player Status
```http
GET /api/players/check/:employeeId
```

**Response:**
```json
{
  "hasCompleted": false
}
```

### Game Result Endpoints

#### Submit Game Result
```http
POST /api/game-results
Content-Type: application/json

{
  "playerId": 1,
  "timeTaken": 125,
  "wordsFound": 10,
  "totalWords": 10,
  "completed": true
}
```

**Response:**
```json
{
  "result": {
    "id": 1,
    "playerId": 1,
    "timeTaken": 125,
    "wordsFound": 10,
    "totalWords": 10,
    "completed": true,
    "completedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get Leaderboard
```http
GET /api/leaderboard
```

**Response:**
```json
{
  "leaderboard": [
    {
      "id": 1,
      "employeeId": "EMP001",
      "name": "John Doe",
      "timeTaken": 125,
      "wordsFound": 10,
      "totalWords": 10,
      "completed": true,
      "completedAt": "2024-01-15T10:30:00.000Z",
      "rank": 1
    }
  ]
}
```

### Admin Endpoints

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error (401):** Invalid credentials

## User Flows

### Player Flow

1. **Registration**
   - Player opens the game
   - Registration modal appears
   - Player enters name and employee ID
   - System validates if player already completed the game
   - If valid, player can proceed

2. **Gameplay**
   - Player clicks "Start Game"
   - 3-minute timer begins
   - Player searches for words in the grid
   - Found words are highlighted and marked
   - Timer counts down in real-time

3. **Completion**
   - **Scenario A: All words found**
     - Game automatically completes
     - Congratulations message shown
     - Results saved to database
     
   - **Scenario B: Time runs out**
     - Game stops automatically
     - "Time's up" message shown
     - Partial results saved to database

4. **Results**
   - Display time taken
   - Display words found
   - Confirm submission to leaderboard
   - Option to return to home (new player)

### Admin Flow

1. **Login**
   - Navigate to `/admin/login`
   - Enter username and password
   - System validates credentials
   - Redirected to admin panel on success

2. **Admin Panel**
   - View word management section
   - Add new words with clues
   - Edit existing words
   - Delete words
   - View real-time leaderboard

3. **Leaderboard**
   - See all completed games
   - Ranked by completion (all words found first)
   - Then sorted by time taken
   - Shows employee ID, name, time, and words found

## Game Rules

1. **One Play Per Employee**: Each employee ID can only complete the game once
2. **Time Limit**: 3 minutes (180 seconds) to find all words
3. **Word Selection**: Click and drag to select words in any direction (horizontal, vertical, diagonal)
4. **Winning Condition**: Find all words before time runs out
5. **Scoring**: Based on completion time and words found

## Security Notes

### Production Deployment

1. **Change Default Admin Passwords**
   ```bash
   npm run db:seed
   ```
   Then manually update passwords in the database

2. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure proper session management
   - Use HTTPS in production

3. **Password Hashing**
   - Currently uses SHA-256
   - Consider bcrypt for production

4. **Session Management**
   - Currently uses sessionStorage (client-side)
   - Implement proper server-side sessions for production

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Push database schema
npm run db:push

# Seed admin users
npm run db:seed
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Wouter (routing)
- Radix UI (components)
- TanStack Query (data fetching)

### Backend
- Express.js
- SQLite (better-sqlite3)
- Drizzle ORM
- TypeScript

### Build Tools
- Vite
- esbuild
- tsx (TypeScript execution)

## Troubleshooting

### Database Issues

**Problem**: Database not found
```bash
# Solution: Initialize database
npm run db:push
npm run db:seed
```

**Problem**: Schema mismatch
```bash
# Solution: Recreate database
rm database.db
npm run db:push
npm run db:seed
```

### Timer Not Working

- Check browser console for errors
- Ensure React StrictMode isn't causing double renders
- Verify timer key prop changes on game start

### Player Registration Failed

- Check if employee ID already exists
- Verify API endpoint is accessible
- Check database connection

### Admin Login Failed

- Verify admin users were seeded
- Check username/password combination
- Inspect browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.

---

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**Remember to change these in production!**