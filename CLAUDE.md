# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PresentPro is an AI-powered presentation generation platform built with Next.js. The application allows users to create professional presentations using AI assistance, with planned features for processing PowerPoint slides and multi-agent AI generation.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **State Management**: React hooks and custom hooks
- **Package Manager**: npm

### Project Structure

```
/app                    # Next.js App Router pages and layouts
  /dashboard           # User dashboard and presentations list
  /presentation-*      # Presentation creation/editing flow
  /api-*              # Future API routes (not implemented)
  layout.tsx          # Root layout with font configuration
  globals.css         # Global styles and Tailwind directives

/components            # Reusable components
  /ui                 # shadcn/ui components (Button, Card, etc.)
  header.tsx          # PrivateHeader component
  user-dropdown.tsx   # User menu with avatar

/lib                  # Utilities and shared code
  utils.ts           # cn() utility for className merging
  constants.ts       # Mock data (mockUser, mockStats)

/types               # TypeScript type definitions
  user.ts           # User and UserSettings interfaces

/public             # Static assets (currently minimal)
```

### Key Architectural Patterns

1. **Mock Data Architecture**: Currently all data is mocked in memory. Key mock data includes:
   - `mockUser` in `/lib/constants.ts`
   - Inline mock data in components (presentations, templates, slides)

2. **Component Organization**:
   - Page components in `/app/[route]/page.tsx`
   - Shared components in `/components`
   - Page-specific components in `/app/[route]/components/`

3. **Custom Hooks**: Complex logic is extracted into custom hooks, especially in the presentation editor:
   - `useSlideDragAndDrop` - Drag and drop functionality
   - `useSlideEditing` - Inline editing capabilities
   - `useHorizontalScroll` - Mouse wheel horizontal scrolling
   - `useChat` - AI assistant chat interface

4. **Styling Approach**:
   - Tailwind CSS for utility classes
   - CSS variables for theming (defined in globals.css)
   - `cn()` utility for conditional classes
   - Consistent spacing and color tokens

## Important Implementation Notes

### Current State
- **No Backend**: All data is mocked, no database integration
- **No Auth**: Authentication UI exists but is not functional
- **No File Processing**: PowerPoint processing is planned but not implemented
- **Static Templates**: Template data is hardcoded in components

### Planned Integrations
- **Supabase**: For database and authentication
- **Stripe**: For payment processing
- **AI Processing**: Multi-agent system for presentation generation
- **File Storage**: For uploaded presentations and generated content

### UI/UX Patterns
- **Navigation**: Three header variants (PublicHeader, MinimalHeader, PrivateHeader)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Loading States**: Simulated with setTimeout in presentation-loading
- **Drag & Drop**: Custom implementation in SlideCarousel
- **Form Handling**: Basic controlled components, no form library yet

### Component Conventions
- TypeScript interfaces for all props
- Consistent naming: `ComponentName.tsx`
- Export functions, not default exports
- Props interfaces named `ComponentNameProps`

## Development Tips

1. **Adding New Pages**: Create folder in `/app` with `page.tsx`
2. **Adding UI Components**: Use `npx shadcn@latest add [component]`
3. **Mock Data**: Add to `/lib/constants.ts` or component state
4. **Type Safety**: Define interfaces in `/types` for shared types
5. **Styling**: Use Tailwind classes, extend in `tailwind.config.ts` if needed

## Current Limitations

1. No test files or testing setup
2. No API routes implemented
3. No environment variables configured
4. No error boundaries or error handling
5. No SEO optimization (meta tags, sitemap)
6. No internationalization support