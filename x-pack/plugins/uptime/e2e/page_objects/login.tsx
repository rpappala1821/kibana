/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { Page } from '@elastic/synthetics';

export function loginPageProvider({
  page,
  isRemote = false,
  username = 'elastic',
  password = 'changeme',
}: {
  page: Page;
  isRemote?: boolean;
  username?: string;
  password?: string;
}) {
  return {
    async waitForLoadingToFinish() {
      while (true) {
        if ((await page.$('[data-test-subj=kbnLoadingMessage]')) === null) break;
        await page.waitForTimeout(5 * 1000);
      }
    },
    async loginToKibana() {
      if (isRemote) {
        await page.click('text="Log in with Elasticsearch"');
      }
      await page.fill('[data-test-subj=loginUsername]', username, {
        timeout: 60 * 1000,
      });
      await page.fill('[data-test-subj=loginPassword]', password);

      await page.click('[data-test-subj=loginSubmit]');

      await this.waitForLoadingToFinish();
    },
  };
}
