# Testing Checklist

Comprehensive testing guide for the Word Search Puzzle application.

---

## Pre-Testing Setup

### Environment Setup
- [ ] Node.js v18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run db:push`)
- [ ] Admin users seeded (`npm run db:seed`)
- [ ] Dev server running (`npm run dev`)
- [ ] Application accessible at http://localhost:5000

### Test Data Preparation
- [ ] Browser cache cleared
- [ ] sessionStorage cleared
- [ ] Fresh database (optional: `rm database.db && npm run db:push && npm run db:seed`)

---

## 1. Player Registration Testing

### Test Case 1.1: First Time Registration
**Steps:**
1. Open http://localhost:5000
2. Enter name: "John Doe"
3. Enter employee ID: "TEST001"
4. Click "Start Game"

**Expected Result:**
- ✓ Registration successful
- ✓ Modal closes
- ✓ Player info appears in header
- ✓ "Start Game" button visible
- ✓ No errors in console

**Status:** [ ] Pass [ ] Fail

---

### Test Case 1.2: Empty Fields Validation
**Steps:**
1. Open http://localhost:5000
2. Leave name empty
3. Enter employee ID: "TEST002"
4. Click "Start Game"

**Expected Result:**
- ✓ Validation error shown
- ✓ Toast notification appears
- ✓ Modal stays open
- ✓ Cannot proceed

**Status:** [ ] Pass [ ] Fail

---

### Test Case 1.3: Duplicate Registration Prevention
**Steps:**
1. Complete a game as "TEST001"
2. Refresh page
3. Try to register again with "TEST001"

**Expected Result:**
- ✓ Error message displayed
- ✓ "Already completed" message shown
- ✓ Cannot proceed to game
- ✓ Toast shows error

**Status:** [ ] Pass [ ] Fail

---

## 2. Timer Testing

### Test Case 2.1: Timer Countdown
**Steps:**
1. Register as new player
2. Click "Start Game"
3. Observe timer for 10 seconds

**Expected Result:**
- ✓ Timer starts at 3:00
- ✓ Counts down continuously: 2:59, 2:58, 2:57...
- ✓ No stopping or jumping
- ✓ Smooth countdown

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.2: Timer Reset on New Game
**Steps:**
1. Start a game
2. Wait 30 seconds
3. Click "New Puzzle"
4. Start game again

**Expected Result:**
- ✓ Timer resets to 3:00
- ✓ Fresh countdown starts
- ✓ No residual time from previous game

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.3: Timer Warning State
**Steps:**
1. Start game
2. Wait until timer shows 0:59

**Expected Result:**
- ✓ Timer turns red
- ✓ Pulsing animation appears
- ✓ Clock icon turns red
- ✓ Visual urgency indicated

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.4: Timer Completion
**Steps:**
1. Start game
2. Don't find any words
3. Wait for timer to reach 0:00

**Expected Result:**
- ✓ Timer stops at 0:00
- ✓ Game ends automatically
- ✓ Results screen appears
- ✓ "Time's Up" message shown

**Status:** [ ] Pass [ ] Fail

---

## 3. Gameplay Testing

### Test Case 3.1: Word Finding
**Steps:**
1. Start game
2. Find the word "QUALITY" (horizontal)
3. Click and drag to select it

**Expected Result:**
- ✓ Word highlights on selection
- ✓ Word appears in found list
- ✓ Grid cells marked/highlighted
- ✓ Word counter updates

**Status:** [ ] Pass [ ] Fail

---

### Test Case 3.2: Multiple Words
**Steps:**
1. Start game
2. Find 3 different words
3. Observe word list

**Expected Result:**
- ✓ All 3 words marked as found
- ✓ Progress indicator updates
- ✓ No duplicate counting
- ✓ Visual feedback for each

**Status:** [ ] Pass [ ] Fail

---

### Test Case 3.3: All Words Found
**Steps:**
1. Start game
2. Find all 10 words
3. Observe behavior

**Expected Result:**
- ✓ Game completes automatically
- ✓ Congratulations message appears
- ✓ Timer stops
- ✓ Results saved to database

**Status:** [ ] Pass [ ] Fail

---

### Test Case 3.4: Grid Interaction
**Steps:**
1. Start game
2. Try selecting invalid word
3. Try selecting in different directions

**Expected Result:**
- ✓ Invalid selections don't count
- ✓ Horizontal selection works
- ✓ Vertical selection works
- ✓ Diagonal selection works

**Status:** [ ] Pass [ ] Fail

---

## 4. Game Completion Testing

### Test Case 4.1: Success Completion
**Steps:**
1. Register as "TEST-SUCCESS"
2. Find all 10 words
3. Note completion time

**Expected Result:**
- ✓ "Congratulations" message shown
- ✓ Completion time displayed
- ✓ "10/10 words" shown
- ✓ Result saved to database
- ✓ Marked as completed

**Status:** [ ] Pass [ ] Fail

---

### Test Case 4.2: Time Out Completion
**Steps:**
1. Register as "TEST-TIMEOUT"
2. Find only 5 words
3. Wait for timer to reach 0:00

**Expected Result:**
- ✓ "Time's Up" message shown
- ✓ Actual time displayed (3:00)
- ✓ "5/10 words" shown
- ✓ Result saved to database
- ✓ Marked as incomplete

**Status:** [ ] Pass [ ] Fail

---

### Test Case 4.3: Results Display
**Steps:**
1. Complete any game
2. Observe results screen

**Expected Result:**
- ✓ Time taken shown in MM:SS format
- ✓ Words found count displayed
- ✓ Completion status clear
- ✓ "Play Again" option available
- ✓ Clean, readable layout

**Status:** [ ] Pass [ ] Fail

---

## 5. Database Testing

### Test Case 5.1: Player Record Creation
**Steps:**
1. Register as "DB-TEST-001"
2. Check database

**Query:**
```sql
SELECT * FROM players WHERE employee_id = 'DB-TEST-001';
```

**Expected Result:**
- ✓ Player record exists
- ✓ Name stored correctly
- ✓ Employee ID stored correctly
- ✓ Timestamp recorded

**Status:** [ ] Pass [ ] Fail

---

### Test Case 5.2: Game Result Storage
**Steps:**
1. Complete a game
2. Check database

**Query:**
```sql
SELECT * FROM game_results ORDER BY id DESC LIMIT 1;
```

**Expected Result:**
- ✓ Result record exists
- ✓ player_id linked correctly
- ✓ time_taken stored in seconds
- ✓ words_found count accurate
- ✓ completed flag correct
- ✓ timestamp recorded

**Status:** [ ] Pass [ ] Fail

---

### Test Case 5.3: Duplicate Prevention
**Steps:**
1. Complete game as "DUP-TEST"
2. Try to register again as "DUP-TEST"
3. Check database

**Expected Result:**
- ✓ Only one game_result record
- ✓ Registration denied
- ✓ No duplicate entries

**Status:** [ ] Pass [ ] Fail

---

## 6. Admin Authentication Testing

### Test Case 6.1: Valid Admin Login
**Steps:**
1. Open http://localhost:5000/admin/login
2. Enter username: "admin"
3. Enter password: "admin123"
4. Click "Login"

**Expected Result:**
- ✓ Login successful
- ✓ Redirected to /admin
- ✓ Admin panel visible
- ✓ sessionStorage contains admin data

**Status:** [ ] Pass [ ] Fail

---

### Test Case 6.2: Invalid Credentials
**Steps:**
1. Open admin login page
2. Enter username: "admin"
3. Enter password: "wrongpassword"
4. Click "Login"

**Expected Result:**
- ✓ Login fails
- ✓ Error message displayed
- ✓ Stays on login page
- ✓ No redirect

**Status:** [ ] Pass [ ] Fail

---

### Test Case 6.3: Direct Admin Access
**Steps:**
1. Clear sessionStorage
2. Try to access http://localhost:5000/admin directly

**Expected Result:**
- ✓ Redirected to /admin/login
- ✓ Cannot access admin panel
- ✓ Authentication enforced

**Status:** [ ] Pass [ ] Fail

---

### Test Case 6.4: Admin Logout
**Steps:**
1. Login as admin
2. Click "Logout" button
3. Try to access /admin

**Expected Result:**
- ✓ sessionStorage cleared
- ✓ Redirected to home page
- ✓ Cannot access admin without relogin
- ✓ Toast confirmation shown

**Status:** [ ] Pass [ ] Fail

---

## 7. Leaderboard Testing

### Test Case 7.1: Leaderboard Display
**Steps:**
1. Login as admin
2. Navigate to admin panel
3. Observe leaderboard section

**Expected Result:**
- ✓ Leaderboard visible
- ✓ All completed games shown
- ✓ Sorted correctly (completion, then time)
- ✓ Ranks assigned properly

**Status:** [ ] Pass [ ] Fail

---

### Test Case 7.2: Leaderboard Sorting
**Steps:**
1. Have 3 players complete games:
   - Player A: 2:30, all words
   - Player B: 2:00, all words
   - Player C: 1:30, 8/10 words
2. Check leaderboard

**Expected Result:**
- ✓ Rank 1: Player B (completed, fastest)
- ✓ Rank 2: Player A (completed, slower)
- ✓ Rank 3: Player C (incomplete)

**Status:** [ ] Pass [ ] Fail

---

### Test Case 7.3: Leaderboard Data
**Steps:**
1. Complete game as "LEADER-TEST"
2. Login as admin
3. Find entry in leaderboard

**Expected Result:**
- ✓ Employee ID shown
- ✓ Player name shown
- ✓ Time formatted correctly (MM:SS)
- ✓ Words count shown (X/Y)
- ✓ Rank number displayed

**Status:** [ ] Pass [ ] Fail

---

### Test Case 7.4: Empty Leaderboard
**Steps:**
1. Fresh database (no games played)
2. Login as admin
3. View leaderboard

**Expected Result:**
- ✓ Empty state message shown
- ✓ "No results yet" displayed
- ✓ No errors
- ✓ Clean UI

**Status:** [ ] Pass [ ] Fail

---

## 8. API Testing

### Test Case 8.1: Player Registration API
**Request:**
```bash
curl -X POST http://localhost:5000/api/players/register \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test","employeeId":"API001"}'
```

**Expected Response:**
```json
{
  "player": {
    "id": 1,
    "employeeId": "API001",
    "name": "API Test"
  }
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test Case 8.2: Game Result Submission API
**Request:**
```bash
curl -X POST http://localhost:5000/api/game-results \
  -H "Content-Type: application/json" \
  -d '{"playerId":1,"timeTaken":125,"wordsFound":10,"totalWords":10,"completed":true}'
```

**Expected Response:**
```json
{
  "result": {
    "id": 1,
    "playerId": 1,
    "timeTaken": 125,
    "wordsFound": 10,
    "totalWords": 10,
    "completed": true
  }
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test Case 8.3: Leaderboard API
**Request:**
```bash
curl http://localhost:5000/api/leaderboard
```

**Expected Response:**
```json
{
  "leaderboard": [
    {
      "id": 1,
      "employeeId": "API001",
      "name": "API Test",
      "timeTaken": 125,
      "wordsFound": 10,
      "totalWords": 10,
      "completed": true,
      "rank": 1
    }
  ]
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test Case 8.4: Admin Login API
**Request:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

**Status:** [ ] Pass [ ] Fail

---

## 9. Edge Cases Testing

### Test Case 9.1: Very Fast Completion
**Steps:**
1. Find all words in under 30 seconds

**Expected Result:**
- ✓ Time recorded accurately
- ✓ Results saved correctly
- ✓ Leaderboard updates
- ✓ No timing issues

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.2: Special Characters in Name
**Steps:**
1. Register with name: "O'Brien-Smith"
2. Complete game

**Expected Result:**
- ✓ Name stored correctly
- ✓ No database errors
- ✓ Displayed properly in leaderboard

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.3: Long Employee ID
**Steps:**
1. Register with ID: "VERYLONGEMPLOYEEID12345"
2. Complete game

**Expected Result:**
- ✓ ID stored correctly
- ✓ Displayed without truncation issues
- ✓ Validation passes

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.4: Browser Refresh During Game
**Steps:**
1. Start game
2. Find 5 words
3. Refresh browser

**Expected Result:**
- ✓ Registration modal appears again
- ✓ Game state reset
- ✓ No corrupted data
- ✓ Can play again

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.5: Multiple Browser Tabs
**Steps:**
1. Open game in Tab 1
2. Open game in Tab 2
3. Register in Tab 1
4. Try to register same ID in Tab 2

**Expected Result:**
- ✓ Each tab independent
- ✓ Duplicate prevention works
- ✓ Database integrity maintained

**Status:** [ ] Pass [ ] Fail

---

## 10. Performance Testing

### Test Case 10.1: Database Query Speed
**Steps:**
1. Add 100 game results
2. Load leaderboard
3. Measure load time

**Expected Result:**
- ✓ Loads in < 1 second
- ✓ No lag
- ✓ Smooth scrolling

**Status:** [ ] Pass [ ] Fail

---

### Test Case 10.2: Timer Accuracy
**Steps:**
1. Start game
2. Use stopwatch to verify
3. Compare after 60 seconds

**Expected Result:**
- ✓ Timer accurate within ±1 second
- ✓ No drift over time
- ✓ Consistent countdown

**Status:** [ ] Pass [ ] Fail

---

### Test Case 10.3: UI Responsiveness
**Steps:**
1. Play game on different screen sizes
2. Test on mobile, tablet, desktop

**Expected Result:**
- ✓ Responsive layout
- ✓ No overflow issues
- ✓ Touch-friendly on mobile
- ✓ Readable text

**Status:** [ ] Pass [ ] Fail

---

## 11. Security Testing

### Test Case 11.1: SQL Injection Prevention
**Steps:**
1. Try registering with: `'; DROP TABLE players; --`

**Expected Result:**
- ✓ Treated as regular string
- ✓ No database modification
- ✓ ORM prevents injection

**Status:** [ ] Pass [ ] Fail

---

### Test Case 11.2: XSS Prevention
**Steps:**
1. Register with name: `<script>alert('XSS')</script>`
2. View in admin leaderboard

**Expected Result:**
- ✓ Script not executed
- ✓ Displayed as text
- ✓ No security vulnerability

**Status:** [ ] Pass [ ] Fail

---

### Test Case 11.3: Password Hashing
**Steps:**
1. Check database admins table
2. Verify password field

**Expected Result:**
- ✓ Password is hashed
- ✓ Not stored in plain text
- ✓ Hash length correct (64 chars for SHA-256)

**Status:** [ ] Pass [ ] Fail

---

## 12. Cross-Browser Testing

### Test Case 12.1: Chrome
**Browser:** Chrome (latest)

**Features to Test:**
- [ ] Timer countdown
- [ ] Word selection
- [ ] Modal interactions
- [ ] Admin login
- [ ] Leaderboard display

**Status:** [ ] Pass [ ] Fail

---

### Test Case 12.2: Firefox
**Browser:** Firefox (latest)

**Features to Test:**
- [ ] Timer countdown
- [ ] Word selection
- [ ] Modal interactions
- [ ] Admin login
- [ ] Leaderboard display

**Status:** [ ] Pass [ ] Fail

---

### Test Case 12.3: Safari
**Browser:** Safari (if available)

**Features to Test:**
- [ ] Timer countdown
- [ ] Word selection
- [ ] Modal interactions
- [ ] Admin login
- [ ] Leaderboard display

**Status:** [ ] Pass [ ] Fail

---

## Summary

### Total Tests: 52

**Passed:** _____
**Failed:** _____
**Skipped:** _____

### Critical Issues Found:
1. _________________
2. _________________
3. _________________

### Minor Issues Found:
1. _________________
2. _________________
3. _________________

### Overall Status:
- [ ] Ready for Production
- [ ] Needs Minor Fixes
- [ ] Needs Major Fixes

---

## Sign-off

**Tester Name:** _________________
**Date:** _________________
**Signature:** _________________

---

**Notes:**
- Use this checklist systematically
- Document all failures with screenshots
- Report critical issues immediately
- Retest after fixes are applied