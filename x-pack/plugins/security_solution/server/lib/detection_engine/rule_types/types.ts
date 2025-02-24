/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Moment } from 'moment';

import { SearchHit } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { Logger } from '@kbn/logging';
import { ALERT_RULE_PARAMETERS } from '@kbn/rule-data-utils';
import { ExceptionListItemSchema } from '@kbn/securitysolution-io-ts-list-types';

import { AlertExecutorOptions, RuleType } from '../../../../../alerting/server';
import {
  AlertInstanceContext,
  AlertInstanceState,
  AlertTypeState,
  WithoutReservedActionGroups,
} from '../../../../../alerting/common';
import { ListClient } from '../../../../../lists/server';
import { TechnicalRuleFieldMap } from '../../../../../rule_registry/common/assets/field_maps/technical_rule_field_map';
import { TypeOfFieldMap } from '../../../../../rule_registry/common/field_map';
import { PersistenceServices, IRuleDataClient } from '../../../../../rule_registry/server';
import { BaseHit } from '../../../../common/detection_engine/types';
import { ConfigType } from '../../../config';
import { SetupPlugins } from '../../../plugin';
import { CompleteRule, RuleParams } from '../schemas/rule_schemas';
import { BuildRuleMessage } from '../signals/rule_messages';
import {
  BulkCreate,
  SearchAfterAndBulkCreateReturnType,
  WrapHits,
  WrapSequences,
} from '../signals/types';
import { ExperimentalFeatures } from '../../../../common/experimental_features';
import { IEventLogService } from '../../../../../event_log/server';
import { AlertsFieldMap, RulesFieldMap } from '../../../../common/field_maps';
import { TelemetryEventsSender } from '../../telemetry/sender';
import { RuleExecutionLoggerFactory } from '../rule_execution_log';
import { commonParamsCamelToSnake } from '../schemas/rule_converters';

export interface SecurityAlertTypeReturnValue<TState extends AlertTypeState> {
  bulkCreateTimes: string[];
  createdSignalsCount: number;
  createdSignals: unknown[];
  errors: string[];
  lastLookbackDate?: Date | null;
  searchAfterTimes: string[];
  state: TState;
  success: boolean;
  warning: boolean;
  warningMessages: string[];
}

export interface RunOpts<TParams extends RuleParams> {
  buildRuleMessage: BuildRuleMessage;
  bulkCreate: BulkCreate;
  exceptionItems: ExceptionListItemSchema[];
  listClient: ListClient;
  completeRule: CompleteRule<TParams>;
  searchAfterSize: number;
  tuple: {
    to: Moment;
    from: Moment;
    maxSignals: number;
  };
  wrapHits: WrapHits;
  wrapSequences: WrapSequences;
}

export type SecurityAlertType<
  TParams extends RuleParams,
  TState extends AlertTypeState,
  TInstanceContext extends AlertInstanceContext = {},
  TActionGroupIds extends string = never
> = Omit<
  RuleType<TParams, TParams, TState, AlertInstanceState, TInstanceContext, TActionGroupIds>,
  'executor'
> & {
  executor: (
    options: AlertExecutorOptions<
      TParams,
      TState,
      AlertInstanceState,
      TInstanceContext,
      WithoutReservedActionGroups<TActionGroupIds, never>
    > & {
      services: PersistenceServices;
      runOpts: RunOpts<TParams>;
    }
  ) => Promise<SearchAfterAndBulkCreateReturnType & { state: TState }>;
};

export interface CreateSecurityRuleTypeWrapperProps {
  lists: SetupPlugins['lists'];
  logger: Logger;
  config: ConfigType;
  ruleDataClient: IRuleDataClient;
  eventLogService: IEventLogService;
  ruleExecutionLoggerFactory: RuleExecutionLoggerFactory;
}

export type CreateSecurityRuleTypeWrapper = (
  options: CreateSecurityRuleTypeWrapperProps
) => <
  TParams extends RuleParams,
  TState extends AlertTypeState,
  TInstanceContext extends AlertInstanceContext = {}
>(
  type: SecurityAlertType<TParams, TState, TInstanceContext, 'default'>
) => RuleType<TParams, TParams, TState, AlertInstanceState, TInstanceContext, 'default'>;

export type RACAlertSignal = TypeOfFieldMap<AlertsFieldMap> & TypeOfFieldMap<RulesFieldMap>;
export type RACAlert = Omit<
  TypeOfFieldMap<TechnicalRuleFieldMap> & RACAlertSignal,
  '@timestamp' | typeof ALERT_RULE_PARAMETERS
> & {
  '@timestamp': string;
  [ALERT_RULE_PARAMETERS]: ReturnType<typeof commonParamsCamelToSnake>;
};

export type RACSourceHit = SearchHit<RACAlert>;
export type WrappedRACAlert = BaseHit<RACAlert>;

export interface CreateRuleOptions {
  experimentalFeatures: ExperimentalFeatures;
  logger: Logger;
  ml?: SetupPlugins['ml'];
  eventsTelemetry?: TelemetryEventsSender | undefined;
  version: string;
}
