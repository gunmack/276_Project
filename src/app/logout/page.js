/**
 * Probably not required, will decide later
 */

import React from 'react';

export default function Logout() {
  return (
    <div className="text-center" data-testid="Logout screen">
      <h1>You have been logged out!!</h1>
      <p>
        Thank you for using our app.
        <br />
        Click{' '}
        <a className="bg-white p-1 rounded-md hover:bg-red-500" href="./">
          here
        </a>{' '}
        to log back in.
      </p>
    </div>
  );
}
