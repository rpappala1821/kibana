/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AnyObject } from '../lib/esqueue';
import { WithRequest } from './with_request';

export class EsIndexClient {
  constructor(readonly self: WithRequest) {}

  public exists(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.exists', params);
  }

  public create(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.create', params);
  }

  public refresh(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.refresh', params);
  }

  public delete(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.delete', params);
  }

  public existsAlias(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.existsAlias', params);
  }

  public getAlias(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.getAlias', params);
  }

  public putAlias(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.putAlias', params);
  }

  public deleteAlias(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.deleteAlias', params);
  }

  public updateAliases(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.updateAliases', params);
  }

  public getMapping(params: AnyObject): Promise<any> {
    return this.self.callWithRequest('indices.getMapping', params);
  }
}
