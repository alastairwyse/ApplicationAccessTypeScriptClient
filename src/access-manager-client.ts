/*
 * Copyright 2025 Alastair Wyse (https://github.com/alastairwyse/ApplicationAccessTypeScriptClient/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IUniqueStringifier } from './iunique-stringifier';
import { ApplicationComponentAndAccessLevel } from './models/application-component-and-access-level';
import { EntityTypeAndEntity } from './models/entity-type-and-entity';
import { IAccessManagerEventProcessor } from './iaccess-manager-event-processor';
import { IAccessManagerQueryProcessor } from './iaccess-manager-query-processor';
import { IAxiosShim } from './iaxios-shim';
import { DefaultAxios } from './default-axios';
import { AccessManagerClientBase } from './access-manager-client-base';
import { AxiosRequestConfig, AxiosHeaders } from 'axios';

/**
 * @name AccessManagerClient
 * @desc Client class which interfaces to an AccessManager instance hosted as a REST web API.
 * 
 * @template TUser - The type of users in the AccessManager.
 * @template TGroup - The type of groups in the AccessManager.
 * @template TComponent - The type of components in the AccessManager.
 * @template TAccess - The type of levels of access which can be assigned to an application component.
 */
export class AccessManagerClient<TUser, TGroup, TComponent, TAccess> 
    extends AccessManagerClientBase<TUser, TGroup, TComponent, TAccess> 
    implements IAccessManagerEventProcessor<TUser, TGroup, TComponent, TAccess>, 
    IAccessManagerQueryProcessor<TUser, TGroup, TComponent, TAccess> {

    /**
     * @desc Creates an AccessManagerClient.
     * 
     * @param baseUrl - The base URL for the hosted Web API.
     * @param userStringifier - A string converter for users.  Used to convert strings sent to and received from the web API from/to {@link TUser} instances.
     * @param groupStringifier - A string converter for groups.  Used to convert strings sent to and received from the web API from/to {@link TGroup} instances.
     * @param applicationComponentStringifier - A string converter for application components.  Used to convert strings sent to and received from the web API from/to {@link TComponent} instances.
     * @param accessLevelStringifier - A string converter for access levels.  Used to convert strings sent to and received from the web API from/to {@link TAccess} instances.
     * @param requestConfig - (Optional) axios request config to use for making HTTP requests.  Allows specifying request headers, timeouts, etc.
     * @param axiosShim - (Optional) {@link https://en.wikipedia.org/wiki/Shim_(computing)| Shim} to axios for use in unit testing.
     */
    constructor (
        baseUrl: URL,
        userStringifier: IUniqueStringifier<TUser>, 
        groupStringifier: IUniqueStringifier<TGroup>, 
        applicationComponentStringifier: IUniqueStringifier<TComponent>, 
        accessLevelStringifier: IUniqueStringifier<TAccess>, 
        requestConfig: AxiosRequestConfig = { headers: new AxiosHeaders() },
        axiosShim: IAxiosShim = new DefaultAxios()
    ) {
        super(baseUrl, userStringifier, groupStringifier, applicationComponentStringifier, accessLevelStringifier, requestConfig, axiosShim);
    }

    /** @inheritdoc */
    public async GetUsers() : Promise<Array<TUser>> {

        let url: URL = this.AppendPathToBaseUrl("users");
        let rawResults: Array<string> = await this.SendGetRequestAsync(url);
        let results = new Array<TUser>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.userStringifier.FromString(rawResults[i]));
        }

        return results;
    }

    /** @inheritdoc */
    public async GetGroups() : Promise<Array<TGroup>> {

        let url: URL = this.AppendPathToBaseUrl("groups");
        let rawResults: Array<string> = await this.SendGetRequestAsync(url);
        let results = new Array<TGroup>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.groupStringifier.FromString(rawResults[i]));
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntityTypes() : Promise<Array<string>> {

        let url: URL = this.AppendPathToBaseUrl("entityTypes");
        let rawResults: Array<string> = await this.SendGetRequestAsync(url);
        let results = new Array<string>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(rawResults[i]);
        }

        return results;
    }

    /** @inheritdoc */
    public async AddUser(user: TUser) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`users/${encodeURIComponent(this.userStringifier.ToString(user))}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async ContainsUser(user: TUser) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveUser(user: TUser) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddGroup(group: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`groups/${encodeURIComponent(this.groupStringifier.ToString(group))}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async ContainsGroup(group: TGroup) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveGroup(group: TGroup) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddUserToGroupMapping(user: TUser, group: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`userToGroupMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/group/${encodeURIComponent(this.groupStringifier.ToString(group))}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetUserToGroupMappings(user: TUser, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetGroupToUserMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TUser>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveUserToGroupMapping(user: TUser, group: TGroup) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddGroupToGroupMapping(fromGroup: TGroup, toGroup: TGroup) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetGroupToGroupMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetGroupToGroupReverseMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveGroupToGroupMapping(fromGroup: TGroup, toGroup: TGroup) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddUserToApplicationComponentAndAccessLevelMapping(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetUserToApplicationComponentAndAccessLevelMappings(user: TUser) : Promise<Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetApplicationComponentAndAccessLevelToUserMappings(applicationComponent: TComponent, accessLevel: TAccess, includeIndirectMappings: Boolean) : Promise<Array<TUser>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveUserToApplicationComponentAndAccessLevelMapping(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddGroupToApplicationComponentAndAccessLevelMapping(group: TGroup, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetGroupToApplicationComponentAndAccessLevelMappings(group: TGroup) : Promise<Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetApplicationComponentAndAccessLevelToGroupMappings(applicationComponent: TComponent, accessLevel: TAccess, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveGroupToApplicationComponentAndAccessLevelMapping(group: TGroup, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddEntityType(entityType: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async ContainsEntityType(entityType: string) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveEntityType(entityType: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddEntity(entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}/entities/${encodeURIComponent(entity)}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetEntities(entityType: string) : Promise<Array<string>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async ContainsEntity(entityType: string, entity: string) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveEntity(entityType: string, entity: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddUserToEntityMapping(user: TUser, entityType: string, entity: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetUserToEntityMappings(user: TUser) : Promise<Array<EntityTypeAndEntity>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetUserToEntityMappingsForType(user: TUser, entityType: string) : Promise<Array<string>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetEntityToUserMappings(entityType: string, entity: string, includeIndirectMappings: boolean) : Promise<Array<TUser>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveUserToEntityMapping(user: TUser, entityType: string, entity: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async AddGroupToEntityMapping(group: TGroup, entityType: string, entity: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetGroupToEntityMappings(group: TGroup) : Promise<Array<EntityTypeAndEntity>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetGroupToEntityMappingsForType(group: TGroup, entityType: string) : Promise<Array<string>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetEntityToGroupMappings(entityType: string, entity: string, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async RemoveGroupToEntityMapping(group: TGroup, entityType: string, entity: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async HasAccessToApplicationComponent(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async HasAccessToEntity(user: TUser, entityType: string, entity: string) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    
    /** @inheritdoc */
    public async GetApplicationComponentsAccessibleByUser(user: TUser) : Promise<Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetApplicationComponentsAccessibleByGroup(group: TGroup) : Promise<Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetEntitiesAccessibleByUser(user: TUser) : Promise<Set<EntityTypeAndEntity>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetEntitiesOfTypeAccessibleByUser(user: TUser, entityType: string) : Promise<Set<string>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetEntitiesAccessibleByGroup(group: TGroup) : Promise<Set<EntityTypeAndEntity>> {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    public async GetEntitiesOfTypeAccessibleByGroup(group: TGroup, entityType: string) : Promise<Set<string>> {
        throw new Error('Method not implemented.');
    }
}