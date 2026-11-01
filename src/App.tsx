/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useGemmaStore } from './core/store';
import { DesktopShell } from './shell/DesktopShell';

export default function App() {
  const bootstrapOS = useGemmaStore((state) => state.bootstrapOS);

  useEffect(() => {
    bootstrapOS();
  }, [bootstrapOS]);

  return <DesktopShell />;
}
