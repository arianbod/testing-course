# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML educational website for a "Complete Testing Course: JavaScript, React & Next.js 15". The course is structured as a comprehensive learning platform with modules, lessons, and interactive elements for teaching modern testing practices.

## Architecture

### File Structure
- `index.html` - Main dashboard/homepage with course overview and module navigation
- `modules/` - Contains lesson HTML files organized by module (1-5)
- `assets/css/styles.css` - Main stylesheet with dark theme and responsive design
- `assets/js/main.js` - Progress tracking JavaScript with localStorage persistence
- `resources/` - Additional learning materials (glossary, cheatsheets, setup guides)
- `curriculum.md` - Complete course curriculum documentation

### Design System
- **Theme**: Dark GitHub-style theme with CSS custom properties
- **Layout**: Mobile-first responsive design with CSS Grid and Flexbox
- **Typography**: System font stack optimized for readability
- **Navigation**: Sticky top navigation with progress indicators
- **Interactive Elements**: Expandable module cards, progress tracking, lesson navigation

### JavaScript Architecture
The main JavaScript uses a `ProgressTracker` class that:
- Manages lesson completion state via localStorage
- Updates UI progress indicators in real-time
- Handles module expansion/collapse
- Tracks overall course progress

### Content Structure
- **5 Modules**: From fundamentals to advanced testing patterns
- **25 Lessons**: Each with structured HTML layout
- **Learning Resources**: Separate resource pages for reference materials
- **Progress System**: Visual progress tracking across modules and lessons

## Development Commands

This is a static website with no build process. Development involves:
- Direct HTML/CSS/JS editing
- Local file serving for testing (e.g., `python -m http.server` or VS Code Live Server)
- No package manager or build tools required

## Key Implementation Details

### Mobile-First Approach
The CSS follows mobile-first principles with responsive breakpoints. Key considerations:
- All layouts use flexible grid systems
- Navigation adapts to mobile screens
- Text sizing and spacing optimize for touch interfaces
- Progress indicators scale appropriately

### Progress Tracking
The progress system persists data using localStorage with the key `testing-course-progress`. It tracks:
- Completed lessons array
- Current lesson
- Last accessed timestamp

### Lesson Structure
Each lesson follows a consistent HTML structure:
- Sidebar navigation with module context
- Main content area with lesson header
- Progress indicators and navigation controls
- Syntax highlighting via Prism.js

### Styling Conventions
- CSS custom properties for theming
- BEM-style class naming
- Consistent spacing using rem units
- Hover and focus states for accessibility

## Content Management

Lessons are structured educational content covering:
1. Testing Fundamentals
2. JavaScript Testing with Vitest
3. React Component Testing
4. Next.js 15 Testing
5. Advanced Testing Patterns

Each lesson includes theoretical content, practical exercises, and code examples with syntax highlighting.