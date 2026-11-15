import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { writeRouteUrl, readRouteUrl } from './src/utils/routeUrl.js';
import { rooms } from './src/data/rooms.js';

test('URL selects only the starting point and its floor, leaving the destination empty', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  const previousWindow = globalThis.window;
  try {
    const { default: App } = await server.ssrLoadModule('/src/components/App.jsx');
    for (const [query, expectedStart, expectedEnd, floor, hasRoute] of [
      ['?start=main3-lobby', 'main3-lobby', '', '3F', false],
      ['?start=main3-lobby&end=cqa', 'main3-lobby', '', '3F', false],
      ['?end=main3-lobby', '', '', 'G', false],
      ['?start=unknown&end=cqa', '', '', 'G', false],
      ['', '', '', 'G', false],
    ]) {
      globalThis.window = { location: { href: `https://example.com/${query}` } };
      const markup = renderToStaticMarkup(React.createElement(App));
      const dropdowns = [...markup.matchAll(/<input[^>]*role="combobox"[^>]*>/g)].map(match => match[0])
        .filter(input => /id="(?:start|end)-room-select"/.test(input));
      assert.equal(dropdowns.length, 2);
      const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      for (const [index, roomId] of [expectedStart, expectedEnd].entries()) {
        const expectedLabel = rooms.find(room => room.id === roomId)?.name || '';
        assert.ok(dropdowns[index].includes(`value="${escapeHtml(expectedLabel)}"`));
        assert.ok(dropdowns[index].includes('aria-expanded="false"'));
      }
      assert.match(markup, new RegExp(`class="view-pill-btn active"[^>]*>.*? ${floor}<`, 's'));
      assert.equal(markup.includes('class="path-overlay-layer"'), hasRoute);
    }
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    await server.close();
  }
});

test('route state supports manual destinations, swap, evacuation, reset and restored origins', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { usePathfinding } = await server.ssrLoadModule('/src/hooks/usePathfinding.js');
    const checks = [
      route => {
        assert.equal(route.startRoom, 'main3-lobby');
        assert.equal(route.endRoom, null);
        route.setEndRoom('cqa');
      },
      route => {
        assert.ok(route.path.length > 1);
        assert.equal(route.hasFloorTransition, true);
        route.swapRooms();
      },
      route => {
        assert.equal(route.startRoom, 'cqa');
        assert.equal(route.endRoom, 'main3-lobby');
        route.setStartRoom('main3-lobby');
      },
      route => {
        assert.equal(route.endRoom, null);
        route.routeToNearestExit();
      },
      route => {
        assert.ok(route.endRoom);
        assert.ok(route.path.length > 1);
        route.reset();
      },
      route => {
        assert.equal(route.startRoom, null);
        assert.equal(route.endRoom, null);
        route.setRooms(readRouteUrl('https://example.com/?start=cqa&end=main3-lobby'));
      },
      route => {
        assert.equal(route.startRoom, 'cqa');
        assert.equal(route.endRoom, null);
        assert.equal(route.path.length, 0);
      },
    ];
    function Harness() {
      const route = usePathfinding({ startRoom: 'main3-lobby' });
      const [step, setStep] = useState(0);
      const savedUrl = writeRouteUrl('https://example.com/?source=qr#map', route);
      assert.deepEqual(readRouteUrl(savedUrl), { startRoom: route.startRoom, endRoom: null });
      checks[step](route);
      if (step < checks.length - 1) setStep(step + 1);
      return null;
    }
    renderToStaticMarkup(React.createElement(Harness));
  } finally {
    await server.close();
  }
});
