'use client';

import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href).origin.replace(/\/$/, '');
  }
  return ''; // Fallback for SSR
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getPathUrl());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>w7Docker API Documentation</h1>
      <p>
        <strong>GET, POST, PATCH, DELETE</strong> requests to{' '}
        <code>{baseUrl}/api</code> with these parameters:
      </p>
      <ul>
        <li><code>id</code>: ID of the row</li>
      </ul>
      <p>The request will return the HTML code in UTF-8 encoding.</p>

      <h3>1. GET Request</h3>
      <p>Fetch user data:</p>
      <pre>
        <code>{`
          curl -X GET ${baseUrl}/api/users
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          Invoke-RestMethod -Uri "${baseUrl}/api/users" -Method Get
        `}</code>
      </pre>

      <h3>2. POST Request</h3>
      <p>Create a new user:</p>
      <pre>
        <code>{`
          curl -X POST ${baseUrl}/api/users -H "Content-Type: application/json" -d '{"name": "new-user-name", "lineStatus": "offline"}'
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          Invoke-RestMethod -Uri "${baseUrl}/api/users" -Method Post -ContentType "application/json" -Body '{"name": "new-user-name", "lineStatus": "offline"}'
        `}</code>
      </pre>

      <h3>3. PATCH Request</h3>
      <p>Update user information:</p>
      <pre>
        <code>{`
          curl -X PATCH ${baseUrl}/api/users?id=1 -H "Content-Type: application/json" -d '{"lineStatus": "online"}'
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          Invoke-RestMethod -Uri "${baseUrl}/api/users?id=1" -Method Patch -ContentType "application/json" -Body '{"lineStatus": "online"}'
        `}</code>
      </pre>

      <h3>4. DELETE Request</h3>
      <p>Delete a user:</p>
      <pre>
        <code>{`
          curl -X DELETE ${baseUrl}/api/users?id=1 -H "Content-Type: application/json" -d '{"id": 1}'
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          Invoke-RestMethod -Uri "${baseUrl}/api/users?id=1" -Method Delete -ContentType "application/json" -Body '{"id": 1}'
        `}</code>
      </pre>
    </div>
  );
};

export default ApiDocumentation;