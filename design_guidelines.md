# Crossword Puzzle Game - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Game/Interactive Applications)

**Primary References:**
- NYT Crossword: Clean grid design, professional puzzle presentation
- Wordle: Celebration animations, simple UI, satisfying feedback
- Kahoot: Competitive energy, real-time leaderboard excitement
- Duolingo: Gamification, progress indicators, rewarding interactions

**Core Design Principles:**
1. Clarity over complexity - puzzle grid must be immediately understandable
2. Responsive feedback - instant visual confirmation for user actions
3. Competitive excitement - leaderboard and timer create urgency
4. Admin efficiency - word management should be quick and intuitive

## Typography

**Font Families:**
- Primary UI: Inter or Poppins (Google Fonts) - clean, modern sans-serif for all interface elements
- Crossword Grid: JetBrains Mono or Roboto Mono - monospaced font for grid cells ensuring perfect alignment

**Type Scale:**
- Hero/Page Titles: text-4xl md:text-5xl, font-bold
- Section Headers: text-2xl md:text-3xl, font-semibold
- Timer Display: text-3xl md:text-4xl, font-bold, tabular-nums
- Grid Cell Numbers: text-xs, font-medium
- Grid Cell Letters: text-xl md:text-2xl, font-semibold
- Clues: text-base, font-normal
- Leaderboard Entries: text-lg, font-medium
- Button Text: text-sm md:text-base, font-semibold
- Form Labels: text-sm, font-medium
- Helper Text: text-xs, text-sm

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 8, 12, and 16
- Component padding: p-4, p-8
- Section spacing: space-y-8, gap-8
- Grid gaps: gap-2, gap-4
- Margins: m-4, m-8, m-12
- Button padding: px-8 py-4

**Container Strategy:**
- Game board: max-w-4xl mx-auto
- Admin panel: max-w-6xl mx-auto
- Leaderboard sidebar: w-80 fixed right-0
- Modal dialogs: max-w-2xl

**Grid System:**
- Crossword grid: CSS Grid with dynamic column/row counts
- Admin word list: Single column with card-based layout
- Leaderboard: Single column list with ranking indicators

## Component Library

### Core Game Components

**Crossword Grid:**
- Square cells with 1:1 aspect ratio
- Border treatment: border-2 for all cells
- Active cell highlight: ring-4 offset
- Filled cells: display uppercase letters
- Cell numbers: absolute positioned top-left, text-xs
- Disabled cells (black squares): distinct background treatment
- Grid container: rounded-lg with border-4
- Responsive sizing: 40px cells on mobile, 50px on tablet, 60px on desktop

**Timer Display:**
- Prominent positioning: top-center or top-right
- Large numeric display with tabular-nums
- Icon: Clock icon from Heroicons
- Progress indicator: Optional circular progress ring
- Warning state: When < 60 seconds remaining (no color reference)

**Clue Panel:**
- Split layout: "Across" and "Down" sections
- Scrollable container: max-h-96 overflow-y-auto
- Clue format: Number + text (e.g., "1. Capital of France")
- Active clue highlighting: Bold text and border-l-4
- Compact spacing: space-y-2

**Completion Celebration:**
- Full-screen overlay with backdrop blur
- Confetti animation (use canvas-confetti library via CDN)
- Trophy/Star icon (Heroicons)
- Completion time display
- "Submit to Leaderboard" form with name input
- Animated entrance: scale and fade-in

### Leaderboard Component

**Real-time Leaderboard:**
- Fixed sidebar on desktop (w-80), sheet/modal on mobile
- Header: "Top Solvers" with trophy icon
- Entry cards: Rank, Name, Time
- Rank indicators: #1, #2, #3 with medal icons (Heroicons)
- Auto-update: Pulse animation when new entry appears
- Empty state: Encouraging message "Be the first to complete!"

### Admin Panel Components

**Word Management Interface:**
- Two-column layout: Form (left) + Word List (right) on desktop
- Add Word Form fields:
  - Word input: uppercase transform
  - Clue input: textarea with character counter
  - Direction: Radio buttons (Across/Down)
  - Submit button: Full-width on mobile
- Word List Cards:
  - Word displayed prominently
  - Clue as secondary text
  - Direction badge
  - Edit and Delete action buttons
  - Hover elevation effect

**Admin Header:**
- Navigation tabs: "Manage Words" | "Active Games" | "Settings"
- Logout button: top-right
- Word count indicator: "X words in database"

### Navigation & Controls

**Game Controls:**
- Start Game button: Large, prominent (px-12 py-4)
- Reset Puzzle button: Secondary styling
- New Puzzle button: Generates new grid from word list
- Check Answers button: Validates current entries (optional feature)

**Navigation Pattern:**
- Top navbar: Logo/Title (left), Timer (center), User Menu (right)
- Admin toggle: Icon button to switch between game/admin modes
- Mobile: Hamburger menu for admin navigation

## Interactive Elements

**Input Interactions:**
- Click cell to select and focus
- Arrow keys to navigate between cells
- Backspace to clear and move back
- Tab to jump to next clue
- Auto-advance to next cell after letter entry
- Keyboard input converts to uppercase automatically

**Feedback Patterns:**
- Cell selection: Immediate visual highlight
- Correct word completion: Subtle scale animation (scale-105) and checkmark icon
- Wrong answer shake: Horizontal shake animation (animate-shake custom keyframes)
- Puzzle completion: Confetti + modal celebration

**Button States:**
- Default: rounded-lg, px-8 py-4
- Hover: transform scale-105, transition-all duration-200
- Active: scale-95
- Disabled: opacity-50, cursor-not-allowed
- Loading: Spinner icon (Heroicons) with spin animation

## Animations & Transitions

**Sparingly Used Animations:**
- Grid cell fill: 100ms ease-in letter appearance
- Completion celebration: Confetti burst + scale entrance
- New leaderboard entry: Slide-in from top with pulse
- Wrong answer: Single shake (300ms)
- Modal entrance: Fade + scale (200ms)
- Timer warning pulse: Gentle pulse when < 1 minute (if implemented)

**Transition Defaults:**
- Standard: transition-all duration-200
- Fast: duration-150
- Smooth: ease-in-out

## Responsive Behavior

**Breakpoints:**
- Mobile (< 768px): Single column, stacked layout, full-width grid
- Tablet (768px - 1024px): Optimized grid sizing, collapsible leaderboard
- Desktop (> 1024px): Full layout with fixed leaderboard sidebar

**Mobile Optimizations:**
- Grid cells: Larger tap targets (44x44px minimum)
- Clue panel: Bottom sheet or expandable section
- Leaderboard: Modal overlay instead of sidebar
- Admin panel: Stacked form and list
- Timer: Sticky top positioning

## Accessibility

**Focus Management:**
- Clear focus indicators: ring-4 ring-offset-2
- Logical tab order: Grid → Clues → Controls
- Skip-to-grid button for keyboard users
- Escape key closes modals

**Screen Reader Support:**
- ARIA labels for grid cells: "Cell 1 across, empty" or "Cell 1 across, letter A"
- Live region announcements for timer updates
- Button labels clearly describe actions
- Form labels properly associated with inputs

**Keyboard Navigation:**
- Full grid navigation with arrow keys
- Enter to submit forms
- Space to activate buttons
- Escape to close modals/panels

## Icon System

**Icon Library:** Heroicons (via CDN)

**Icon Usage:**
- Clock/Timer: clock icon
- Trophy/Winner: trophy icon
- Add Word: plus-circle icon
- Delete Word: trash icon
- Edit: pencil icon
- Check/Correct: check-circle icon
- Close/Cancel: x-mark icon
- Menu: bars-3 icon
- User: user-circle icon

**Icon Sizing:**
- Small: w-4 h-4 (inline with text)
- Medium: w-6 h-6 (buttons, cards)
- Large: w-8 h-8 (headers, celebrations)
- Hero: w-16 h-16 (completion modal)

## Images

**No hero images required** - This is a game interface focused on functionality and the crossword grid itself as the primary visual element.

**Optional decorative elements:**
- Achievement badges/medals for leaderboard top 3 (can use icons instead)
- Background pattern: Subtle grid pattern or geometric shapes (CSS-generated)

This design creates an engaging, competitive crossword puzzle game with clear visual hierarchy, satisfying interactions, and efficient admin controls while maintaining accessibility and responsive functionality across all devices.