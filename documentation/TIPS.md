# Running the Softphone Admin UI Locally

This document offers some tips and tricks for running the Admin UI locally.

## The Session Cookie

When you first fire up the Admin UI, you likely see this error:

<img src="./badCookie.png" alt="Error 500" width="500"/>

This error is caused by a missing or expired session cookie.  

To fix it, follow these steps:
1. Open a new Chrome tab, and navigate to the development instance
of the Triton UI at:  https://triton-dev.lmig.com/triton-admin
2. Open the Chrome Development Tools window (F12)
3. Select the Application tab, and then expand Cookies on the left
4. Click on the https://triton-dev.lmig.com site
5. Click on the PA.ciciccttritondev1 cookie
6. Copy the value of the cookie to the clipboard
7. Go back to the Chrome tab for your local instance
8. Find the same cookie and update its value from the clipboard.  If it doesn't exist,
create it from the browser console.
9. This cookie expires every 30 minutes, so you may have to go through this
procedure twice if you copy the dev cookie just before it expires

<img src="./chromeDevTools.png" alt="Chrome Developer Tools"/>

## Flash and Closed Message Retrieval Fails
This is a known problem - retrieval of Flash and Closed messages fails.  This failure can
be seen in the Network tab of Chrome Developer Tools:

<img src="./messageErrors.png" alt="Error 500"/>

The work-around is to test features related to these message types
in the development environment, rather than locally.

## Site Can't Be Reached
<img src="./cantReach.png" alt="Website can't be reached"/>

There are a couple of things that may cause this error:
1. Your browser should be pointed at:  http://localhost:8082/triton-admin
2. the cicct-user-gateway and cicct-softphone-service repos must be running on your desktop, 
as described in the [main readme](../README.md).

