/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSpacer, EuiTab, EuiTabs } from '@elastic/eui';
import React, { useMemo, useState } from 'react';
import { CreatePreBuiltRules } from '../../../../containers/detection_engine/rules';
import * as i18n from '../translations';
import { RulesTables } from './rules_tables';

interface AllRulesProps {
  createPrePackagedRules: CreatePreBuiltRules | null;
  hasPermissions: boolean;
  loading: boolean;
  loadingCreatePrePackagedRules: boolean;
  rulesCustomInstalled: number | null;
  rulesInstalled: number | null;
  rulesNotInstalled: number | null;
  rulesNotUpdated: number | null;
  setRefreshRulesData: (refreshRule: () => Promise<void>) => void;
}

export enum AllRulesTabs {
  rules = 'rules',
  monitoring = 'monitoring',
  exceptions = 'exceptions',
}

const allRulesTabs = [
  {
    id: AllRulesTabs.rules,
    name: i18n.RULES_TAB,
    disabled: false,
  },
  {
    id: AllRulesTabs.monitoring,
    name: i18n.MONITORING_TAB,
    disabled: false,
  },
];
/**
 * Table Component for displaying all Rules for a given cluster. Provides the ability to filter
 * by name, sort by enabled, and perform the following actions:
 *   * Enable/Disable
 *   * Duplicate
 *   * Delete
 *   * Import/Export
 */
export const AllRules = React.memo<AllRulesProps>(
  ({
    createPrePackagedRules,
    hasPermissions,
    loading,
    loadingCreatePrePackagedRules,
    rulesCustomInstalled,
    rulesInstalled,
    rulesNotInstalled,
    rulesNotUpdated,
    setRefreshRulesData,
  }) => {
    const [allRulesTab, setAllRulesTab] = useState(AllRulesTabs.rules);

    const tabs = useMemo(
      () => (
        <EuiTabs>
          {allRulesTabs.map((tab) => (
            <EuiTab
              data-test-subj={`allRulesTableTab-${tab.id}`}
              onClick={() => setAllRulesTab(tab.id)}
              isSelected={tab.id === allRulesTab}
              disabled={tab.disabled}
              key={tab.id}
            >
              {tab.name}
            </EuiTab>
          ))}
        </EuiTabs>
      ),
      [allRulesTab]
    );

    return (
      <>
        {tabs}
        <EuiSpacer />
        <RulesTables
          createPrePackagedRules={createPrePackagedRules}
          hasPermissions={hasPermissions}
          loading={loading}
          loadingCreatePrePackagedRules={loadingCreatePrePackagedRules}
          rulesCustomInstalled={rulesCustomInstalled}
          rulesInstalled={rulesInstalled}
          rulesNotInstalled={rulesNotInstalled}
          rulesNotUpdated={rulesNotUpdated}
          selectedTab={allRulesTab}
          setRefreshRulesData={setRefreshRulesData}
        />
      </>
    );
  }
);

AllRules.displayName = 'AllRules';
