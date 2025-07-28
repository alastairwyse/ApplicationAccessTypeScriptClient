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

import { ApplicationComponentAndAccessLevel } from './models/application-component-and-access-level';
import { EntityTypeAndEntity } from './models/entity-type-and-entity';

/**
 * @name IAccessManagerQueryProcessor
 * @desc Defines methods which query the state/structure of an AccessManager implementation.
 * 
 * @template TUser - The type of users in the AccessManager.
 * @template TGroup - The type of groups in the AccessManager.
 * @template TComponent - The type of components in the AccessManager.
 * @template TAccess - The type of levels of access which can be assigned to an application component.
 */
export interface IAccessManagerQueryProcessor<TUser, TGroup, TComponent, TAccess> {

    /**
     * @name GetUsers
     * 
     * @returns Returns a collection of all users in the access manager.
     */
    GetUsers() : Promise<Array<TUser>>;
    
    /**
     * @returns Returns a collection of all groups in the access manager.
     */
    GetGroups() : Promise<Array<TGroup>>;
    
    /**
     * @returns Returns a collection of all entity types in the access manager.
     */
    GetEntityTypes() : Promise<Array<string>>;

    /**
     * @name ContainsUser
     * @desc Returns true if the specified user exists.
     * 
     * @param user - The user check for.
     * @returns True if the user exists.  False otherwise.
     */
    ContainsUser(user: TUser) : Promise<boolean>;

    /**
     * @name ContainsGroup
     * @desc Returns true if the specified group exists.
     * 
     * @param group - The group check for.
     * @returns True if the group exists.  False otherwise.
     */
    ContainsGroup(group: TGroup) : Promise<boolean>;

    /**
     * @name GetUserToGroupMappings
     * @desc Gets the groups that the specified user is mapped to (i.e. is a member of).
     * 
     * @param user - The user to retrieve the groups for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those that occur via group to group mappings).
     * @returns A collection of groups the specified user is a member of.
     */
    GetUserToGroupMappings(user: TUser, includeIndirectMappings: boolean) : Promise<Array<TGroup>>;

    /**
     * @name GetGroupToUserMappings
     * @desc Gets the users that are mapped to the specified group.
     * 
     * @param group - The group to retrieve the users for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where a user is mapped to the group via other groups).
     * @returns A collection of users that are mapped to the specified group.
     */
    GetGroupToUserMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TUser>>;

    /**
     * @name GetGroupToGroupMappings
     * @desc Gets the groups that the specified group is mapped to.
     * 
     * @param group - The group to retrieve the mapped groups for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where the 'mapped to' group is itself mapped to further groups).
     * @returns A collection of groups the specified group is mapped to.
     */
    GetGroupToGroupMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TGroup>>;

    /**
     * @name GetGroupToGroupReverseMappings
     * @desc Gets the groups that are mapped to the specified group.
     * 
     * @param group - The group to retrieve the mapped groups for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where the 'mapped from' group is itself mapped from further groups).
     * @returns A collection of groups that are mapped to the specified group.
     */
    GetGroupToGroupReverseMappings(group: TGroup, includeIndirectMappings: boolean) : Promise<Array<TGroup>>;

    /**
     * @name GetUserToApplicationComponentAndAccessLevelMappings
     * @desc Gets the application component and access level pairs that the specified user is mapped to.
     * 
     * @param user - The user to retrieve the mappings for.
     * @returns A collection of {@link ApplicationComponentAndAccessLevel} pairs that the specified user is mapped to.
     */
    GetUserToApplicationComponentAndAccessLevelMappings(user: TUser) : Promise<Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>>;

    /**
     * @name GetApplicationComponentAndAccessLevelToUserMappings
     * @desc Gets the users that are mapped to the specified application component and access level pair.
     * 
     * @param applicationComponent - The application component to retrieve the mappings for.
     * @param accessLevel - The access level to retrieve the mappings for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where a user is mapped to an application component and access level via groups).
     * @returns A collection of users that are mapped to the specified application component and access level.
     */
    GetApplicationComponentAndAccessLevelToUserMappings(applicationComponent: TComponent, accessLevel: TAccess, includeIndirectMappings: Boolean) : Promise<Array<TUser>>;

    /**
     * @name GetGroupToApplicationComponentAndAccessLevelMappings
     * @desc Gets the application component and access level pairs that the specified group is mapped to.
     * 
     * @param group - The group to retrieve the mappings for.
     * @returns A collection of {@link ApplicationComponentAndAccessLevel} pairs that the specified group is mapped to.
     */
    GetGroupToApplicationComponentAndAccessLevelMappings(group: TGroup) : Promise<Array<ApplicationComponentAndAccessLevel<TComponent, TAccess>>>;

    /**
     * @name GetApplicationComponentAndAccessLevelToGroupMappings
     * @desc Gets the groups that are mapped to the specified application component and access level pair.
     * 
     * @param applicationComponent - The application component to retrieve the mappings for.
     * @param accessLevel - The access level to retrieve the mappings for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where a group is mapped to an application component and access level via other groups).
     * @returns A collection of groups that are mapped to the specified application component and access level.
     */
    GetApplicationComponentAndAccessLevelToGroupMappings(applicationComponent: TComponent, accessLevel: TAccess, includeIndirectMappings: boolean) : Promise<Array<TGroup>>;

    /**
     * @name ContainsEntityType
     * @desc Returns true if the specified entity type exists.
     * 
     * @param entityType - The entity type to check for.
     * @returns True if the entity type exists.  False otherwise.
     */
    ContainsEntityType(entityType: string) : Promise<boolean>;

    /**
     * @name GetEntities
     * @desc Returns all entities of the specified type.
     * 
     * @param entityType - The type of the entity.
     * @returns A collection of all entities of the specified type.
     */
    GetEntities(entityType: string) : Promise<Array<string>>;

    /**
     * @name ContainsEntity
     * @desc Returns true if the specified entity exists.
     * 
     * @param entityType - The type of the entity.
     * @param entity - The entity to check for.
     * @returns True if the entity exists.  False otherwise.
     */
    ContainsEntity(entityType: string, entity: string) : Promise<boolean>;

    /**
     * @name GetUserToEntityMappings
     * @desc Gets the entities that the specified user is mapped to.
     * 
     * @param user - The user to retrieve the mappings for.
     * @returns A collection of {@link EntityTypeAndEntity} that the specified user is mapped to.
     */
    GetUserToEntityMappings(user: TUser) : Promise<Array<EntityTypeAndEntity>>;

    /**
     * @name GetUserToEntityMappings
     * @desc Gets the entities of a given type that the specified user is mapped to.
     * 
     * @param user - The user to retrieve the mappings for.
     * @param entityType - The entity type to retrieve the mappings for.
     * @returns A collection of entities that the specified user is mapped to.
     */
    GetUserToEntityMappingsForType(user: TUser, entityType: string) : Promise<Array<string>>;

    /**
     * @name GetEntityToUserMappings
     * @desc Gets the users that are mapped to the specified entity.
     * 
     * @param entityType - The entity type to retrieve the mappings for.
     * @param entity - The entity to retrieve the mappings for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where a user is mapped to the entity via groups).
     * @returns A collection of users that are mapped to the specified entity.
     */
    GetEntityToUserMappings(entityType: string, entity: string, includeIndirectMappings: boolean) : Promise<Array<TUser>>;

    /**
     * @name GetGroupToEntityMappings
     * @desc Gets the entities that the specified group is mapped to.
     * 
     * @param group - The group to retrieve the mappings for.
     * @returns A collection of {@link EntityTypeAndEntity} that the specified group is mapped to.
     */
    GetGroupToEntityMappings(group: TGroup) : Promise<Array<EntityTypeAndEntity>>;

    /**
     * @name GetGroupToEntityMappings
     * @desc Gets the entities of a given type that the specified group is mapped to.
     * 
     * @param group - The group to retrieve the mappings for.
     * @param entityType - The entity type to retrieve the mappings for.
     * @returns A collection of entities that the specified group is mapped to.
     */
    GetGroupToEntityMappingsForType(group: TGroup, entityType: string) : Promise<Array<string>>;

    /**
     * @name GetEntityToGroupMappings
     * @desc Gets the groups that are mapped to the specified entity.
     * 
     * @param entityType - The entity type to retrieve the mappings for.
     * @param entity - The entity to retrieve the mappings for.
     * @param includeIndirectMappings - Whether to include indirect mappings (i.e. those where a group is mapped to the entity via other groups).
     * @returns A collection of groups that are mapped to the specified entity.
     */
    GetEntityToGroupMappings(entityType: string, entity: string, includeIndirectMappings: boolean) : Promise<Array<TGroup>>;
    
    /**
     * @name HasAccessToApplicationComponent
     * @desc Checks whether the specified user (or a group that the user is a member of) has access to an application component at the specified level of access.
     * 
     * @param user - The user to check for.
     * @param applicationComponent - The application component.
     * @param accessLevel - The level of access to the component.
     * @returns True if the user has access the component.  False otherwise.
     */
    HasAccessToApplicationComponent(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<boolean>;

    /**
     * @name HasAccessToEntity
     * @desc Checks whether the specified user (or a group that the user is a member of) has access to the specified entity.
     * 
     * @param user - The user to check for.
     * @param entityType - The type of the entity.
     * @param entity - The entity.
     * @returns True if the user has access the entity.  False otherwise.
     */
    HasAccessToEntity(user: TUser, entityType: string, entity: string) : Promise<boolean>;

    /**
     * @name GetApplicationComponentsAccessibleByUser
     * @desc Gets all application components and levels of access that the specified user (or a group that the user is a member of) has access to.
     * 
     * @param user - The user to retrieve the application components and levels of access for.
     * @returns The application components and levels of access to those application components that the user has access to.
     */
    GetApplicationComponentsAccessibleByUser(user: TUser) : Promise<Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>>;

    /**
     * @name GetApplicationComponentsAccessibleByGroup
     * @desc Gets all application components and levels of access that the specified group (or group that the specified group is mapped to) has access to.
     * 
     * @param group - The group to retrieve the application components and levels of access for.
     * @returns The application components and levels of access to those application components that the group has access to.
     */
    GetApplicationComponentsAccessibleByGroup(group: TGroup) : Promise<Set<ApplicationComponentAndAccessLevel<TComponent, TAccess>>>;

    /**
     * @name GetEntitiesAccessibleByUser
     * @desc Gets all entities that the specified user (or a group that the user is a member of) has access to.
     * 
     * @param user - The user to retrieve the entities for.
     * @returns A collection of Tuples containing the entity type and entity that the user has access to.
     */
    GetEntitiesAccessibleByUser(user: TUser) : Promise<Set<EntityTypeAndEntity>>;

    /**
     * @name GetEntitiesAccessibleByUser
     * @desc Gets all entities of a given type that the specified user (or a group that the user is a member of) has access to.
     * 
     * @param user - The user to retrieve the entities for.
     * @param entityType - The type of entities to retrieve.
     * @returns The entities the user has access to.
     */
    GetEntitiesOfTypeAccessibleByUser(user: TUser, entityType: string) : Promise<Set<string>>;

    /**
     * @name GetEntitiesAccessibleByGroup
     * @desc Gets all entities that the specified group (or a group that the specified group is a member of) has access to.
     * 
     * @param group - The group to retrieve the entities for.
     * @returns A collection of Tuples containing the entity type and entity that the group has access to.
     */
    GetEntitiesAccessibleByGroup(group: TGroup) : Promise<Set<EntityTypeAndEntity>>;

    /**
     * @name GetEntitiesAccessibleByGroup
     * @desc Gets all entities of a given type that the specified group (or a group that the specified group is a member of) has access to.
     * 
     * @param group - The group to retrieve the entities for.
     * @param entityType - The type of entities to retrieve.
     * @returns The entities the group has access to.
     */
    GetEntitiesOfTypeAccessibleByGroup(group: TGroup, entityType: string) : Promise<Set<string>>;
}