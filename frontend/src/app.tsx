// App.tsx - Main application component that sets up routing and layout structure
// This is the root component that defines all routes and wraps them with the Layout component

import { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
// Article-related components for home, viewing, and creating articles
import { 
  Home, 
  Article, 
  CreateArticle,
  EditArticle,
  UserArticles 
} from './components/articles';
// Authentication-related components for login, signup, and protected routes
import { 
  Login, 
  Signup, 
  ProtectedRoute 
} from './components/auth';
// User-related components for profile management
import { 
  Profile, 
  UserProfile 
} from './components/user';
// Main layout component that provides navigation and footer
import Layout from './components/layout/Layout';
// Static page components
import Privacy from './routes/privacy';
import Terms from './routes/terms';
import About from './routes/about';
import NotFound from './routes/[...404]';
// Global CSS styles
import './app.css';
import { Link, MetaProvider } from '@solidjs/meta';

// Main App component that defines the routing structure and layout
const App: Component = () => {
  return (
    <>
    <MetaProvider>
    <Link rel="preconnect" href="https://fonts.googleapis.com" />
    <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <Link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <Link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&display=swap" rel="stylesheet" />

    </MetaProvider>
  <Router>
      {/* All routes are wrapped with Layout component for consistent navigation/footer */}
      <Route path="/" component={Layout}>
        {/* Public home page route */}
        <Route path="/" component={Home} />
        {/* Authentication routes */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {/* Protected route for creating articles - requires authentication */}
        <Route path="/create" component={() => (
          <ProtectedRoute feature="write and share your stories">
            <CreateArticle />
          </ProtectedRoute>
        )} />
        {/* Protected route for user profile - requires authentication */}
        <Route path="/profile" component={() => (
          <ProtectedRoute feature="view your profile and manage your articles">
            <Profile />
          </ProtectedRoute>
        )} />
        {/* Protected route for managing user's articles - requires authentication */}
        <Route path="/my-articles" component={() => (
          <ProtectedRoute feature="manage your articles">
            <UserArticles />
          </ProtectedRoute>
        )} />
        {/* Public route for viewing other users' profiles */}
        <Route path="/user/:id" component={UserProfile} />
        {/* Protected route for editing articles - requires authentication and ownership */}
        <Route path="/:username/:slug/edit" component={() => (
          <ProtectedRoute feature="edit your articles">
            <EditArticle />
          </ProtectedRoute>
        )} />
        {/* Dynamic route for viewing individual articles by username and slug */}
        <Route path="/:username/:slug" component={Article} />
        {/* Static page routes */}
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/about" component={About} />
        {/* Catch-all route for 404 errors - must be last */}
        <Route path="/*all" component={NotFound} />
      </Route>
    </Router>
    </>
  )
};

export default App;