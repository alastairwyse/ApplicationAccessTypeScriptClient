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

        let url: URL = this.AppendPathToBaseUrl(`users/${encodeURIComponent(this.userStringifier.ToString(user))}`);

        return await this.SendGetRequestForContainsMethodAsync(url);
    }

    /** @inheritdoc */
    public async RemoveUser(user: TUser) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`users/${encodeURIComponent(this.userStringifier.ToString(user))}`);

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddGroup(group: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`groups/${encodeURIComponent(this.groupStringifier.ToString(group))}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async ContainsGroup(group: TGroup) : Promise<boolean> {

        let url: URL = this.AppendPathToBaseUrl(`groups/${encodeURIComponent(this.groupStringifier.ToString(group))}`);

        return await this.SendGetRequestForContainsMethodAsync(url);
    }

    /** @inheritdoc */
    public async RemoveGroup(group: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`groups/${encodeURIComponent(this.groupStringifier.ToString(group))}`);

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddUserToGroupMapping(user: TUser, group: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `userToGroupMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/group/${encodeURIComponent(this.groupStringifier.ToString(group))}`
        );

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetUserToGroupMappings(user: TUser, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `userToGroupMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}?includeIndirectMappings=${includeIndirectMappings})}`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TGroup>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.groupStringifier.FromString(rawResults[i].group));
        }

        return results;
    }

    /** @inheritdoc */
    public async GetGroupToUserMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TUser>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `userToGroupMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=${includeIndirectMappings})}`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TUser>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.userStringifier.FromString(rawResults[i].user));
        }

        return results;
    }

    /** @inheritdoc */
    public async RemoveUserToGroupMapping(user: TUser, group: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `userToGroupMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/group/${encodeURIComponent(this.groupStringifier.ToString(group))}`
        );

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddGroupToGroupMapping(fromGroup: TGroup, toGroup: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `groupToGroupMappings/fromGroup/${encodeURIComponent(this.groupStringifier.ToString(fromGroup))}/toGroup/${encodeURIComponent(this.groupStringifier.ToString(toGroup))}`
        );

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetGroupToGroupMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `groupToGroupMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=${includeIndirectMappings})}`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TGroup>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.groupStringifier.FromString(rawResults[i].group));
        }

        return results;
    }

    /** @inheritdoc */
    public async GetGroupToGroupReverseMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `groupToGroupReverseMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=${includeIndirectMappings})}`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TGroup>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.groupStringifier.FromString(rawResults[i].group));
        }

        return results;
    }

    /** @inheritdoc */
    public async RemoveGroupToGroupMapping(fromGroup: TGroup, toGroup: TGroup) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `groupToGroupMappings/fromGroup/${encodeURIComponent(this.groupStringifier.ToString(fromGroup))}/toGroup/${encodeURIComponent(this.groupStringifier.ToString(toGroup))}`
        );

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddUserToApplicationComponentAndAccessLevelMapping(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `userToApplicationComponentAndAccessLevelMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}`
        );

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetUserToApplicationComponentAndAccessLevelMappings(user: TUser) : Promise<Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `userToApplicationComponentAndAccessLevelMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}?includeIndirectMappings=false`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                new ApplicationComponentAndAccessLevel<TComponent, TAccess>(
                    this.applicationComponentStringifier.FromString(rawResults[i].applicationComponent), 
                    this.accessLevelStringifier.FromString(rawResults[i].accessLevel)
                )
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetApplicationComponentAndAccessLevelToUserMappings(applicationComponent: TComponent, accessLevel: TAccess, includeIndirectMappings: Boolean) : Promise<Array<TUser>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `userToApplicationComponentAndAccessLevelMappings/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}?includeIndirectMappings=${includeIndirectMappings}`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TUser>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.userStringifier.FromString(rawResults[i].user));
        }

        return results;
    }

    /** @inheritdoc */
    public async RemoveUserToApplicationComponentAndAccessLevelMapping(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `userToApplicationComponentAndAccessLevelMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}`
        );

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddGroupToApplicationComponentAndAccessLevelMapping(group: TGroup, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `groupToApplicationComponentAndAccessLevelMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}`
        );

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetGroupToApplicationComponentAndAccessLevelMappings(group: TGroup) : Promise<Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `groupToApplicationComponentAndAccessLevelMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=false`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                new ApplicationComponentAndAccessLevel<TComponent, TAccess>(
                    this.applicationComponentStringifier.FromString(rawResults[i].applicationComponent), 
                    this.accessLevelStringifier.FromString(rawResults[i].accessLevel)
                )
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetApplicationComponentAndAccessLevelToGroupMappings(applicationComponent: TComponent, accessLevel: TAccess, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {
        
        let url: URL = this.AppendPathToBaseUrl(
            `groupToApplicationComponentAndAccessLevelMappings/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}?includeIndirectMappings=${includeIndirectMappings}`
        );
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TGroup>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(this.groupStringifier.FromString(rawResults[i].group));
        }

        return results;
    }

    /** @inheritdoc */
    public async RemoveGroupToApplicationComponentAndAccessLevelMapping(group: TGroup, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `groupToApplicationComponentAndAccessLevelMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}`
        );

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddEntityType(entityType: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async ContainsEntityType(entityType: string) : Promise<boolean> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}`);

        return await this.SendGetRequestForContainsMethodAsync(url);
    }

    /** @inheritdoc */
    public async RemoveEntityType(entityType: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}`);

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddEntity(entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}/entities/${encodeURIComponent(entity)}`);

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetEntities(entityType: string) : Promise<Array<string>> {
        
        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}/entities`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<string>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(rawResults[i].entity);
        }

        return results;
    }

    /** @inheritdoc */
    public async ContainsEntity(entityType: string, entity: string) : Promise<boolean> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}/entities/${encodeURIComponent(entity)}`);

        return await this.SendGetRequestForContainsMethodAsync(url);
    }

    /** @inheritdoc */
    public async RemoveEntity(entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(`entityTypes/${encodeURIComponent(entityType)}/entities/${encodeURIComponent(entity)}`);

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddUserToEntityMapping(user: TUser, entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `userToApplicationComponentAndAccessLevelMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}`
        );

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetUserToEntityMappings(user: TUser) : Promise<Array<EntityTypeAndEntity>> {
        
        let url: URL = this.AppendPathToBaseUrl(`userToEntityMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}?includeIndirectMappings=false`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<EntityTypeAndEntity>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                new EntityTypeAndEntity(
                    rawResults[i].entityType, 
                    rawResults[i].entity
                ) 
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetUserToEntityMappingsForType(user: TUser, entityType: string) : Promise<Array<string>> {
        
        let url: URL = this.AppendPathToBaseUrl(`userToEntityMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/entityType/${encodeURIComponent(entityType)}?includeIndirectMappings=false`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<string>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                rawResults[i].entity
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntityToUserMappings(entityType: string, entity: string, includeIndirectMappings: boolean) : Promise<Array<TUser>> {
        
        let url: URL = this.AppendPathToBaseUrl(`userToEntityMappings/entities/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}?includeIndirectMappings=${includeIndirectMappings}`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TUser>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                this.userStringifier.FromString(rawResults[i].user)
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async RemoveUserToEntityMapping(user: TUser, entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `userToApplicationComponentAndAccessLevelMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}`
        );

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async AddGroupToEntityMapping(group: TGroup, entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `groupToApplicationComponentAndAccessLevelMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}`
        );

        await this.SendPostRequestAsync(url);
    }

    /** @inheritdoc */
    public async GetGroupToEntityMappings(group: TGroup) : Promise<Array<EntityTypeAndEntity>> {
        
        let url: URL = this.AppendPathToBaseUrl(`groupToEntityMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=false`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<EntityTypeAndEntity>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                new EntityTypeAndEntity(
                    rawResults[i].entityType, 
                    rawResults[i].entity
                ) 
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetGroupToEntityMappingsForType(group: TGroup, entityType: string) : Promise<Array<string>> {
        
        let url: URL = this.AppendPathToBaseUrl(`groupToEntityMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}/entityType/${encodeURIComponent(entityType)}?includeIndirectMappings=false`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<string>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                rawResults[i].entity
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntityToGroupMappings(entityType: string, entity: string, includeIndirectMappings: boolean) : Promise<Array<TGroup>> {

        let url: URL = this.AppendPathToBaseUrl(`groupToEntityMappings/entities/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}?includeIndirectMappings=${includeIndirectMappings}`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Array<TGroup>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.push(
                this.groupStringifier.FromString(rawResults[i].group)
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async RemoveGroupToEntityMapping(group: TGroup, entityType: string, entity: string) : Promise<void> {

        let url: URL = this.AppendPathToBaseUrl(
            `groupToApplicationComponentAndAccessLevelMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}`
        );

        await this.SendDeleteRequestAsync(url);
    }

    /** @inheritdoc */
    public async HasAccessToApplicationComponent(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<boolean> {

        let url: URL = this.AppendPathToBaseUrl(
            `dataElementAccess/applicationComponent/${encodeURIComponent(this.userStringifier.ToString(user))}/applicationComponent/${encodeURIComponent(this.applicationComponentStringifier.ToString(applicationComponent))}/accessLevel/${encodeURIComponent(this.accessLevelStringifier.ToString(accessLevel))}`
        );
        
        return await this.SendGetRequestAsync(url);
    }

    /** @inheritdoc */
    public async HasAccessToEntity(user: TUser, entityType: string, entity: string) : Promise<boolean> {

        let url: URL = this.AppendPathToBaseUrl(
            `dataElementAccess/applicationComponent/${encodeURIComponent(this.userStringifier.ToString(user))}/entityType/${encodeURIComponent(entityType)}/entity/${encodeURIComponent(entity)}`
        );
        
        return await this.SendGetRequestAsync(url);
    }
    
    /** @inheritdoc */
    public async GetApplicationComponentsAccessibleByUser(user: TUser) : Promise<Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {

        let url: URL = this.AppendPathToBaseUrl(`userToApplicationComponentAndAccessLevelMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}?includeIndirectMappings=true`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.add(
                new ApplicationComponentAndAccessLevel<TComponent, TAccess>(
                    this.applicationComponentStringifier.FromString(rawResults[i].applicationComponent), 
                    this.accessLevelStringifier.FromString(rawResults[i].accessLevel)
                ) 
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetApplicationComponentsAccessibleByGroup(group: TGroup) : Promise<Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>> {

        let url: URL = this.AppendPathToBaseUrl(`groupToApplicationComponentAndAccessLevelMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=true`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.add(
                new ApplicationComponentAndAccessLevel<TComponent, TAccess>(
                    this.applicationComponentStringifier.FromString(rawResults[i].applicationComponent), 
                    this.accessLevelStringifier.FromString(rawResults[i].accessLevel)
                ) 
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntitiesAccessibleByUser(user: TUser) : Promise<Set<EntityTypeAndEntity>> {

        let url: URL = this.AppendPathToBaseUrl(`userToEntityMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}?includeIndirectMappings=true`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Set<EntityTypeAndEntity>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.add(
                new EntityTypeAndEntity(
                    rawResults[i].entityType, 
                    rawResults[i].entity
                ) 
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntitiesOfTypeAccessibleByUser(user: TUser, entityType: string) : Promise<Set<string>> {

        let url: URL = this.AppendPathToBaseUrl(`userToEntityMappings/user/${encodeURIComponent(this.userStringifier.ToString(user))}/entityType/${encodeURIComponent(entityType)}?includeIndirectMappings=true`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Set<string>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.add(
                rawResults[i].entity
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntitiesAccessibleByGroup(group: TGroup) : Promise<Set<EntityTypeAndEntity>> {

        let url: URL = this.AppendPathToBaseUrl(`groupToEntityMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}?includeIndirectMappings=true`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Set<EntityTypeAndEntity>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.add(
                new EntityTypeAndEntity(
                    rawResults[i].entityType, 
                    rawResults[i].entity
                ) 
            );
        }

        return results;
    }

    /** @inheritdoc */
    public async GetEntitiesOfTypeAccessibleByGroup(group: TGroup, entityType: string) : Promise<Set<string>> {

        let url: URL = this.AppendPathToBaseUrl(`groupToEntityMappings/group/${encodeURIComponent(this.groupStringifier.ToString(group))}/entityType/${encodeURIComponent(entityType)}?includeIndirectMappings=true`);
        let rawResults: Array<any> = await this.SendGetRequestAsync(url);
        let results = new Set<string>();
        for (let i: number = 0; i < rawResults.length; i++) {
            results.add(
                rawResults[i].entity
            );
        }

        return results;
    }
}