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

/**
 * @name IAccessManagerEventProcessor
 * @desc Defines methods to process events which change the structure of an AccessManager implementation.
 * 
 * @template TUser - The type of users in the AccessManager.
 * @template TGroup - The type of groups in the AccessManager.
 * @template TComponent - The type of components in the AccessManager.
 * @template TAccess - The type of levels of access which can be assigned to an application component.
 */
export interface IAccessManagerEventProcessor<TUser, TGroup, TComponent, TAccess> {

    /**
     * @name AddUser
     * @desc Adds a user.
     * 
     * @param user - The user to add.
     */
    AddUser(user: TUser) : Promise<void>;

    /**
     * @name RemoveUser
     * @desc Removes a user.
     * 
     * @param user - The user to remove.
     */
    RemoveUser(user: TUser) : Promise<void>;

    /**
     * @name AddGroup
     * @desc Adds a group.
     * 
     * @param group - The group to add.
     */
    AddGroup(group: TGroup) : Promise<void>;

    /**
     * @name RemoveGroup
     * @desc Removes a group.
     * 
     * @param group - The group to remove.
     */
    RemoveGroup(group: TGroup) : Promise<void>;

    /**
     * @name AddUserToGroupMapping
     * @desc Adds a mapping between the specified user and group.
     * 
     * @param user - The user in the mapping.
     * @param group - The group in the mapping.
     */
    AddUserToGroupMapping(user: TUser, group: TGroup) : Promise<void>;

    /**
     * @name RemoveUserToGroupMapping
     * @desc Removes the mapping between the specified user and group.
     * 
     * @param user - The user in the mapping.
     * @param group - The group in the mapping.
     */
    RemoveUserToGroupMapping(user: TUser, group: TGroup) : Promise<void>;

    /**
     * @name AddGroupToGroupMapping
     * @desc Adds a mapping between the specified groups.
     * 
     * @param fromGroup - The 'from' group in the mapping.
     * @param toGroup - The 'to' group in the mapping.
     */
    AddGroupToGroupMapping(fromGroup: TGroup, toGroup: TGroup) : Promise<void>;

    /**
     * @name RemoveGroupToGroupMapping
     * @desc Removes the mapping between the specified groups.
     * 
     * @param fromGroup - The 'from' group in the mapping.
     * @param toGroup - The 'to' group in the mapping.
     */
    RemoveGroupToGroupMapping(fromGroup: TGroup, toGroup: TGroup) : Promise<void>;

    /**
     * @name AddUserToApplicationComponentAndAccessLevelMapping
     * @desc Adds a mapping between the specified user, application component, and level of access to that component.
     * 
     * @param user - The user in the mapping.
     * @param applicationComponent - The application component in the mapping.
     * @param accessLevel - The level of access to the component.
     */
    AddUserToApplicationComponentAndAccessLevelMapping(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void>;

    /**
     * @name RemoveUserToApplicationComponentAndAccessLevelMapping
     * @desc Removes a mapping between the specified user, application component, and level of access to that component.
     * 
     * @param user - The user in the mapping.
     * @param applicationComponent - The application component in the mapping.
     * @param accessLevel - The level of access to the component.
     */
    RemoveUserToApplicationComponentAndAccessLevelMapping(user: TUser, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void>;

    /**
     * @name AddGroupToApplicationComponentAndAccessLevelMapping
     * @desc Adds a mapping between the specified group, application component, and level of access to that component.
     * 
     * @param group - The group in the mapping.
     * @param applicationComponent - The application component in the mapping.
     * @param accessLevel - The level of access to the component.
     */
    AddGroupToApplicationComponentAndAccessLevelMapping(group: TGroup, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void>;

    /**
     * @name RemoveGroupToApplicationComponentAndAccessLevelMapping
     * @desc Removes a mapping between the specified group, application component, and level of access to that component.
     * 
     * @param group - The group in the mapping.
     * @param applicationComponent - The application component in the mapping.
     * @param accessLevel - The level of access to the component.
     */
    RemoveGroupToApplicationComponentAndAccessLevelMapping(group: TGroup, applicationComponent: TComponent, accessLevel: TAccess) : Promise<void>;

    /**
     * @name AddEntityType
     * @desc Adds an entity type.
     * 
     * @param entityType - The entity type to add.
     */
    AddEntityType(entityType: string) : Promise<void>;

    /**
     * @name RemoveEntityType
     * @desc Removes an entity type.
     * 
     * @param entityType - The entity type to remove.
     */
    RemoveEntityType(entityType: string) : Promise<void>;

    /**
     * @name AddEntity
     * @desc Adds an entity.
     * 
     * @param entityType - The type of the entity.
     * @param entity - The entity to add.
     */
    AddEntity(entityType: string, entity: string) : Promise<void>;

    /**
     * @name RemoveEntity
     * @desc Removes an entity.
     * 
     * @param entityType - The type of the entity.
     * @param entity - The entity to remove.
     */
    RemoveEntity(entityType: string, entity: string) : Promise<void>;

    /**
     * @name AddUserToEntityMapping
     * @desc Removes a mapping between the specified user, and entity.
     * 
     * @param user - The user in the mapping.
     * @param entityType - The type of the entity.
     * @param entity - The entity in the mapping.
     */
    AddUserToEntityMapping(user: TUser, entityType: string, entity: string) : Promise<void>;

    /**
     * @name RemoveUserToEntityMapping
     * @desc Removes a mapping between the specified user, and entity.
     * 
     * @param user - The user in the mapping.
     * @param entityType - The type of the entity.
     * @param entity - The entity in the mapping.
     */
    RemoveUserToEntityMapping(user: TUser, entityType: string, entity: string) : Promise<void>;

    /**
     * @name AddGroupToEntityMapping
     * @desc Removes a mapping between the specified group, and entity.
     * 
     * @param group - The group in the mapping.
     * @param entityType - The type of the entity.
     * @param entity - The entity in the mapping.
     */
    AddGroupToEntityMapping(group: TGroup, entityType: string, entity: string) : Promise<void>;

    /**
     * @name 
     * @desc Removes a mapping between the specified group, and entity.
     * 
     * @param group - The group in the mapping.
     * @param entityType - The type of the entity.
     * @param entity - The entity in the mapping.
     */
    RemoveGroupToEntityMapping(group: TGroup, entityType: string, entity: string) : Promise<void>;
}