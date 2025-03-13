# PWA Implementation Guide

This project has been set up as a Progressive Web App (PWA), which allows users to install it on their devices and use it offline. This README provides instructions for completing the PWA setup and testing the functionality.

## Generating Icons

The PWA requires several icon files to display properly on different devices. You need to create the following icon files:

1. **icon-192x192.png** - A 192x192 pixel PNG icon for Android devices
2. **icon-512x512.png** - A 512x512 pixel PNG icon for Android devices
3. **apple-touch-icon.png** - A 180x180 pixel PNG icon for iOS devices
4. **favicon.ico** - A favicon for browser tabs (typically 16x16, 32x32, and 48x48 pixels)

You can use the `public/icons/generate-icons.html` file to help create these icons:

1. Open the file in a browser: `http://localhost:3000/icons/generate-icons.html`
2. Follow the instructions on the page to save the icons
3. Replace the placeholder text files with the actual icon files

## Testing PWA Functionality

To test the PWA functionality:

1. Build the project:
   ```
   npm run build
   ```

2. Start the server:
   ```
   npm run dev:server
   ```

3. Open the application in Chrome: `http://localhost:3000`

4. Open Chrome DevTools (F12 or Ctrl+Shift+I)

5. Go to the "Application" tab

6. In the left sidebar, under "Application", click on "Manifest" to verify the manifest is loaded correctly

7. Under "Service Workers", verify that the service worker is registered and active

8. To test installation:
   - Look for the install icon in the address bar (desktop) or
   - Use "Add to Home Screen" option in the browser menu (mobile)

9. To test offline functionality:
   - Go to the "Network" tab in DevTools
   - Check the "Offline" checkbox
   - Reload the page - it should still work!

## Troubleshooting

If the PWA is not working as expected:

1. Check the browser console for errors
2. Verify that all icon files exist and are in the correct locations
3. Make sure the service worker is registered correctly
4. Clear the browser cache and reload

## PWA Features Implemented

- Web App Manifest with app metadata
- Service Worker for offline functionality
- Icon set for various devices
- Installation capability
- Offline access to the application

## Additional Resources

- [MDN Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox) (for advanced service worker strategies)
