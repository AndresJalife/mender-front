import { store } from '../store/store';
import { resetStore } from '../store/auth';
import { clearFilters } from '../store/filter';

export const cacheService = {
    /**
     * Clear all cache when user logs in or signs up
     * This ensures a fresh state for the new user session
     */
    clearAllCache: () => {
        console.log('Clearing all cache...');
        
        // Reset Redux store to initial state
        store.dispatch(resetStore());
        
        // Clear user filters
        store.dispatch(clearFilters());
        
        // Note: Component-level cache (like posts, seenTmdbIds) will be 
        // automatically cleared when components remount due to authentication state change
    },

    /**
     * Clear only authentication-related cache (for logout)
     */
    clearAuthCache: () => {
        console.log('Clearing auth cache...');
        // This is handled by the logout action in auth slice
    },

    /**
     * Clear user-specific data cache (posts, preferences, etc.)
     * Useful when switching between different user accounts
     */
    clearUserDataCache: () => {
        console.log('Clearing user data cache...');
        
        // Clear user-specific filters
        store.dispatch(clearFilters());
        
        // Note: Posts, seenTmdbIds, and other component state will be 
        // automatically cleared when components remount
    }
};

export default cacheService; 