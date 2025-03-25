import {screen, render, cleanup } from '@testing-library/react';
import { describe, it, afterEach, expect, vi } from 'vitest';
import Console from '../Console.jsx'; 
import React from 'react';

//Creating a mock of created pixi/dom elements, so that functions in Console.jsx work.
vi.mock('pixi.js', () => {
  const mockGraphics = {
    rect: vi.fn().mockReturnThis(),
    fill: vi.fn(),
    filters: [],
  };

  return {
    Application: vi.fn(() => ({
      init: vi.fn().mockResolvedValue(null),
      canvas: document.createElement('div'),
      screen: { width: 800, height: 600 },
      stage: { addChild: vi.fn() },
      destroy: vi.fn(),
    })),
    Graphics: vi.fn(() => mockGraphics),
    FillGradient: vi.fn(() => ({})),
  };
});

vi.mock('pixi-filters', () => ({
  PixelateFilter: vi.fn(),
}));




describe('Console Component - textState Tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('Renders no messages when textState is empty', () => {

    render(<Console textState={[]} />)
    const messageElements = screen.queryAllByTestId("console_text")
    expect(messageElements).toHaveLength(0);
  });

});