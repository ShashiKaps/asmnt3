'use client';

import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    // Remove port from origin
    return `${url.protocol}//${url.hostname}`;
  }
  return '';
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getPathUrl());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Inject heading styles */}
      <style>{`
        h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        h2 { font-size: 1.5em; font-weight: bold; margin-top: 1.2em; }
        h3 { font-size: 1.2em; font-weight: bold; margin-top: 1em; }
      `}</style>

      <h1>Week 9: Monitoring Instrumentation Dashboard Links</h1>

      <h2>Go to:</h2>
      <p>
        <a href={`${baseUrl}:3000/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:3000/
        </a>
      </p>
      <br />

      <h2>Check the API:</h2>
      <p>
        <a href={`${baseUrl}:3000/api/hello`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:3000/api/hello
        </a>
      </p>
      <br />

      <h3>Try with curl:</h3>
      <pre>
        <code>curl {baseUrl}:3000/api/hello</code>
      </pre>
      <br />

      <h2>Open Jaeger:</h2>
      <p>
        Set Services to <strong>'next-app'</strong>, Loopback - <strong>'last hour'</strong>, then click "find"
      </p>
      <p>
        <a href={`${baseUrl}:16686/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:16686/
        </a>
      </p>
      <br />

      <h2>Open Prometheus:</h2>
      <p>
        Search for: <strong>otelcol_exporter_enqueue_failed_metric_points</strong>
        <br />
        Remember to set the date/time (typically today).
      </p>
      <p>
        <a href={`${baseUrl}:9090/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:9090/
        </a>
      </p>
      <br />

      <h2>Open Zipkin:</h2>
      <p>
        Set <strong>'ServiceName'</strong> to <strong>Next-app</strong>
        <br />
        Set <strong>'loopback'</strong> to the last hour, then click 'Run Query'
      </p>
      <p>
        <a href={`${baseUrl}:9411/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:9411/
        </a>
      </p>
      <br />

      <h2>Open Metrics - OpenTelemetry Logs:</h2>
      <p>
        <a href={`${baseUrl}:8888/metrics`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:8888/metrics
        </a>
        <br />
        <a href={`${baseUrl}:8888/metrics`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:8889/metrics
        </a>
      </p>
    </div>
  );
};

export default ApiDocumentation;