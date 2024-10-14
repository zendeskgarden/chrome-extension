/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import config from '@zendeskgarden/eslint-config';
import noticePlugin from '@zendeskgarden/eslint-config/plugins/notice.js';
import prettierConfig from 'eslint-config-prettier';
import typescriptPlugin from '@zendeskgarden/eslint-config/plugins/typescript.js';
import typescriptTypeCheckedPlugin from '@zendeskgarden/eslint-config/plugins/typescript-type-checked.js';

export default [
  ...config,
  noticePlugin,
  prettierConfig,
  typescriptPlugin,
  typescriptTypeCheckedPlugin,
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': 'off',
      'n/no-unsupported-features/node-builtins': ['error', { version: '>=21.0.0' }],
      '@typescript-eslint/no-deprecated': 'off' /* disable invalid `chrome` warnings */
    }
  }
];
