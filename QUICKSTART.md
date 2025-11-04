# Quick Start Guide

Get the Word Search Puzzle application running in 5 minutes!

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher

## Setup (3 steps)

### 1. Install Dependencies
```bash
cd CrosswordBuilder
npm install
```

### 2. Initialize Database
```bash
npm run db:push
npm run db:seed
```

This creates:
- SQLite database (`database.db`)
- Admin users with default credentials

### 3. Start Server
```bash
npm run dev
```

The application will start at: **http://localhost:5000**

---

## Quick Test

### Test as Player

1. **Open the game**: http://localhost:5000
2. **Register**:
   - Name: `Test Player`
   - Employee ID: `EMP001`
   - Click "Start Game"
3. **Play**:
   - Find words in the grid
   - Timer counts down from 3:00
   - Watch words get marked off the list
4. **Finish**:
   - Find all words OR wait for timer to end
   - See your results

### Test as Admin

1. **Open admin login**: http://localhost:5000/admin/login
2. **Login**:
   - Username: `admin`
   - Password: `admin123`
3. **View leaderboard**:
   - See all player results
   - Rankings by completion and time
4. **Manage words**:
   - Add new words
   - Edit existing words
   - Delete words

---

## Default Admin Credentials

| Username | Password |
|----------|----------|
| admin | admin123 |
| superadmin | super123 |

⚠️ **Change these passwords in production!**

---

## Key Features to Test

### Player Features
- ✓ One-time play per employee ID
- ✓ Player registration required
- ✓ 3-minute countdown timer
- ✓ Real-time word tracking
- ✓ Auto-save results
- ✓ Completion messages

### Admin Features
- ✓ Secure login
- ✓ View leaderboard
- ✓ See who finished first
- ✓ Manage word list
- ✓ Track all attempts

---

## Troubleshooting

### Database Error
```bash
# Reset database
rm database.db
npm run db:push
npm run db:seed
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Timer Not Working
- Refresh the page
- Clear browser cache
- Check browser console for errors

---

## Testing Scenarios

### Scenario 1: Successful Completion
1. Register as `EMP001`
2. Start game
3. Find all 10 words
4. See congratulations message
5. Check leaderboard as admin

### Scenario 2: Time Out
1. Register as `EMP002`
2. Start game
3. Find only 5 words
4. Wait for timer to reach 0:00
5. See "Time's Up" message
6. Check leaderboard shows partial completion

### Scenario 3: Duplicate Prevention
1. Register as `EMP001` (already completed)
2. See error message
3. Cannot proceed to game

### Scenario 4: Admin Management
1. Login as admin
2. View leaderboard
3. Add new word
4. Edit existing word
5. Delete word
6. Logout

---

## File Locations

| Item | Location |
|------|----------|
| Database | `./database.db` |
| Logs | Browser console |
| Config | `drizzle.config.ts` |
| Schema | `shared/schema.ts` |

---

## Next Steps

1. **Customize Words**: Edit word list in AdminPage
2. **Change Passwords**: Update admin credentials
3. **Adjust Timer**: Change duration in GamePage (default: 180s)
4. **Style**: Modify Tailwind classes
5. **Deploy**: Run `npm run build` and `npm start`

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Update schema
npm run db:seed          # Seed admin users

# Production
npm run build            # Build for production
npm start                # Start production server

# Type Checking
npm run check            # Run TypeScript check
```

---

## Support

- **Documentation**: See `README.md` for full docs
- **Changes**: See `CHANGES.md` for implementation details
- **Issues**: Check browser console and terminal output

---

## Success Criteria

✅ Player can register and play
✅ Timer counts down properly
✅ Words can be found
✅ Results are saved
✅ Admin can login
✅ Leaderboard shows data
✅ One play per employee enforced

---

**Ready to go!** 🎮

Open http://localhost:5000 and start playing!