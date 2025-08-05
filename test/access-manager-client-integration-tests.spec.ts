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

import { ApplicationComponentAndAccessLevel } from '../src/models/application-component-and-access-level';
import { EntityTypeAndEntity } from '../src/models/entity-type-and-entity';
import { ApplicationScreen } from './application-screen';
import { AccessLevel } from './access-level';
import { IUniqueStringifier } from '../src/iunique-stringifier';
import { StringUniqueStringifier } from '../src/string-unique-stringifier';
import { AccessManagerClient } from '../src/access-manager-client';

/**
 * @desc Integration tests for the AccessManagerClient class.
 */
describe("AccessManagerClient Integration Tests", () => {

    const urlReservedCharacters = "! * ' ( ) ; : @ & = + $ , / ? % # [ ]";
    const clientAccounts: string = "clientAccounts";
    const company1: string = "company1";
    const company2: string = "company2";
    const company3: string = "company3";
    const company4: string = "company4";
    const company5: string = "company5";
    const company6: string = "company6";
    const company7: string = "company7";
    const company8: string = "company8";
    const company9: string = "company9";
    const company10: string = "company10";
    const productLines: string = "productLines";
    const line1: string = "line1";
    const line2: string = "line2";
    const line3: string = "line3";
    const line4: string = "line4";
    const line5: string = "line5";
    const line6: string = "line6";
    const line7: string = "line7";
    const line8: string = "line8";
    const line9: string = "line9";
    const line10: string = "line10";
    const unmapped: string = "Unmapped";

    let userStringifier: CallCountingStringUniqueStringifier;
    let groupStringifier: CallCountingStringUniqueStringifier;
    let componentStringifier: ApplicationScreenStringifier;
    let accessStringifier: AccessLevelStringifier;
    let testClient: AccessManagerClient<string, string, ApplicationScreen, AccessLevel>;

    beforeEach(() => {
        userStringifier = new CallCountingStringUniqueStringifier;
        groupStringifier = new CallCountingStringUniqueStringifier;
        componentStringifier = new ApplicationScreenStringifier;
        accessStringifier = new AccessLevelStringifier;
        testClient = new AccessManagerClient(
            new URL("http://127.0.0.1:5170/"), 
            userStringifier, 
            groupStringifier, 
            componentStringifier, 
            accessStringifier
        );
    });

            
    afterEach(() => { 
    });


    it("ConnectionExceptionTests.", async() => {

        testClient = new AccessManagerClient(
            new URL("http://127.0.0.1:100/"), 
            userStringifier, 
            groupStringifier, 
            componentStringifier, 
            accessStringifier
        );
        let exceptionCaught: boolean = false;

        try {
            await testClient.GetUsers();

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:100/api/v1/users' with 'Get' method.  connect ECONNREFUSED 127.0.0.1:100");
        }
        expect(exceptionCaught).toBe(true); 


        exceptionCaught = false;

        try {
            await testClient.ContainsUser("InvalidUser");

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:100/api/v1/users/InvalidUser' with 'Get' method.  connect ECONNREFUSED 127.0.0.1:100");
        }
        expect(exceptionCaught).toBe(true); 


        exceptionCaught = false;

        try {
            await testClient.AddUser("user1");

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:100/api/v1/users/user1' with 'Post' method.  connect ECONNREFUSED 127.0.0.1:100");
        }
        expect(exceptionCaught).toBe(true); 


        exceptionCaught = false;

        try {
            await testClient.RemoveUser("user1");

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:100/api/v1/users/user1' with 'Delete' method.  connect ECONNREFUSED 127.0.0.1:100");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("UrlReservedCharacters.", async() => {

        await testClient.AddUser(urlReservedCharacters);
        await testClient.AddGroup(urlReservedCharacters);
        await testClient.AddGroup("group1");
        await testClient.AddGroup("group2");
        await testClient.AddUserToGroupMapping(urlReservedCharacters, urlReservedCharacters);
        await testClient.AddGroupToGroupMapping(urlReservedCharacters, "group1");
        await testClient.AddGroupToGroupMapping("group2",  urlReservedCharacters);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping(urlReservedCharacters, ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping(urlReservedCharacters, ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters);
        await testClient.AddEntityType(urlReservedCharacters);
        await testClient.AddEntity(urlReservedCharacters, urlReservedCharacters);
        await testClient.AddUserToEntityMapping(urlReservedCharacters, urlReservedCharacters, urlReservedCharacters);
        await testClient.AddGroupToEntityMapping(urlReservedCharacters, urlReservedCharacters, urlReservedCharacters);
       
        let containsResult: boolean = await testClient.ContainsUser(urlReservedCharacters);
        expect(containsResult).toBe(true);
        containsResult = await testClient.ContainsGroup(urlReservedCharacters);
        expect(containsResult).toBe(true);
        let userToGroupMappings: Array<string> = await testClient.GetUserToGroupMappings(urlReservedCharacters, false);
        expect(userToGroupMappings.length).toBe(1);
        let groupToUserMappings: Array<string> = await testClient.GetGroupToUserMappings(urlReservedCharacters, false);
        expect(groupToUserMappings.length).toBe(1);
        let groupToGroupMappings: Array<string> = await testClient.GetGroupToGroupMappings(urlReservedCharacters, false);
        expect(groupToGroupMappings.length).toBe(1);
        let groupToGroupReverseMappings: Array<string> = await testClient.GetGroupToGroupReverseMappings(urlReservedCharacters, false);
        expect(groupToGroupReverseMappings.length).toBe(1);
        let userComponentMappings: Array<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetUserToApplicationComponentAndAccessLevelMappings(urlReservedCharacters);
        expect(userComponentMappings.length).toBe(1);
        let users: Array<string> = await testClient.GetApplicationComponentAndAccessLevelToUserMappings(ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters, false);
        expect(users.length).toBe(1);
        let groupComponentMappings: Array<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetGroupToApplicationComponentAndAccessLevelMappings(urlReservedCharacters);
        expect(groupComponentMappings.length).toBe(1);
        let groups: Array<string> = await testClient.GetApplicationComponentAndAccessLevelToGroupMappings(ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters, false);
        expect(groups.length).toBe(1);
        containsResult = await testClient.ContainsEntityType(urlReservedCharacters);
        expect(containsResult).toBe(true);
        let entities: Array<string> = await testClient.GetEntities(urlReservedCharacters);
        expect(entities.length).toBe(1);
        containsResult = await testClient.ContainsEntity(urlReservedCharacters, urlReservedCharacters);
        expect(containsResult).toBe(true);
        let userEntityMappings: Array<EntityTypeAndEntity> = await testClient.GetUserToEntityMappings(urlReservedCharacters);
        expect(userEntityMappings.length).toBe(1);
        entities = await testClient.GetUserToEntityMappingsForType(urlReservedCharacters, urlReservedCharacters);
        expect(entities.length).toBe(1);
        users = await testClient.GetEntityToUserMappings(urlReservedCharacters, urlReservedCharacters, false);
        expect(users.length).toBe(1);
        let groupEntityMappings: Array<EntityTypeAndEntity> = await testClient.GetGroupToEntityMappings(urlReservedCharacters);
        expect(groupEntityMappings.length).toBe(1);
        entities = await testClient.GetGroupToEntityMappingsForType(urlReservedCharacters, urlReservedCharacters);
        expect(entities.length).toBe(1);
        groups = await testClient.GetEntityToGroupMappings(urlReservedCharacters, urlReservedCharacters, false);
        expect(groups.length).toBe(1);
        let hasAccessResult: boolean = await testClient.HasAccessToApplicationComponent(urlReservedCharacters, ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters);
        expect(hasAccessResult).toBe(true);
        hasAccessResult = await testClient.HasAccessToEntity(urlReservedCharacters, urlReservedCharacters, urlReservedCharacters);
        expect(hasAccessResult).toBe(true);
        let userComponentMappingsSet: Set<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetApplicationComponentsAccessibleByUser(urlReservedCharacters);
        expect(userComponentMappingsSet.size).toBe(1);
        let groupComponentMappingsSet: Set<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetApplicationComponentsAccessibleByGroup(urlReservedCharacters);
        expect(groupComponentMappingsSet.size).toBe(1);
        let userEntityMappingsSet: Set<EntityTypeAndEntity> = await testClient.GetEntitiesAccessibleByUser(urlReservedCharacters);
        expect(userEntityMappingsSet.size).toBe(1);
        let entitiesSet: Set<string> = await testClient.GetEntitiesOfTypeAccessibleByUser(urlReservedCharacters, urlReservedCharacters);
        expect(entitiesSet.size).toBe(1);
        let groupEntityMappingsSet: Set<EntityTypeAndEntity> = await testClient.GetEntitiesAccessibleByGroup(urlReservedCharacters);
        expect(groupEntityMappingsSet.size).toBe(1);
        entitiesSet = await testClient.GetEntitiesOfTypeAccessibleByGroup(urlReservedCharacters, urlReservedCharacters);
        expect(entitiesSet.size).toBe(1);

        await testClient.RemoveGroupToEntityMapping(urlReservedCharacters, urlReservedCharacters, urlReservedCharacters);
        await testClient.RemoveUserToEntityMapping(urlReservedCharacters, urlReservedCharacters, urlReservedCharacters);
        await testClient.RemoveEntity(urlReservedCharacters, urlReservedCharacters);
        await testClient.RemoveEntityType(urlReservedCharacters);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping(urlReservedCharacters, ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping(urlReservedCharacters, ApplicationScreen.ReservedCharacters, AccessLevel.ReservedCharacters);
        await testClient.RemoveGroupToGroupMapping("group2",  urlReservedCharacters);
        await testClient.RemoveGroupToGroupMapping(urlReservedCharacters, "group1");
        await testClient.RemoveUserToGroupMapping(urlReservedCharacters, urlReservedCharacters);
        await testClient.RemoveGroup("group2");
        await testClient.RemoveGroup("group1");
        await testClient.RemoveGroup(urlReservedCharacters);
        await testClient.RemoveUser(urlReservedCharacters);
    });


    it("GettersOnEmptyAccessManager.", async() => {

        let allUsers: Array<string> = await testClient.GetUsers();
        expect(allUsers.length).toBe(0);
        
        let allGroups: Array<string> = await testClient.GetGroups();
        expect(allGroups.length).toBe(0);
        
        let allEntityTypes: Array<string> = await testClient.GetEntityTypes();
        expect(allEntityTypes.length).toBe(0);
    });


    it("AddElementsAndMappings.", async() => {

        await testClient.AddUser("user1");
        await testClient.AddUser("user2");
        await testClient.AddUser("user3");
        await testClient.AddUser("user4");
        await testClient.AddUser("user5");
        await testClient.AddUser("user6");
        await testClient.AddUser("user7");
        await testClient.AddUser("user8");
        await testClient.AddUser("user9");
        await testClient.AddUser("user10");
        await testClient.AddUser("user11");
        await testClient.AddUser("user12");
        await testClient.AddUser("unmappedUser1");
        await testClient.AddUser("orphanedUser");

        await testClient.AddGroup("group1");
        await testClient.AddGroup("group2");
        await testClient.AddGroup("group3");
        await testClient.AddGroup("group4");
        await testClient.AddGroup("group5");
        await testClient.AddGroup("group6");
        await testClient.AddGroup("unmappedGroup1");
        await testClient.AddGroup("unmappedGroup2");
        await testClient.AddGroup("orphanedGroup");

        await testClient.AddEntityType(clientAccounts);
        await testClient.AddEntityType(productLines);
        await testClient.AddEntityType(unmapped);
        await testClient.AddEntity(clientAccounts, company1);
        await testClient.AddEntity(clientAccounts, company2);
        await testClient.AddEntity(clientAccounts, company3);
        await testClient.AddEntity(clientAccounts, company4);
        await testClient.AddEntity(clientAccounts, company5);
        await testClient.AddEntity(clientAccounts, company6);
        await testClient.AddEntity(clientAccounts, company7);
        await testClient.AddEntity(clientAccounts, company8);
        await testClient.AddEntity(clientAccounts, company9);
        await testClient.AddEntity(clientAccounts, company10);
        await testClient.AddEntity(productLines, line1);
        await testClient.AddEntity(productLines, line2);
        await testClient.AddEntity(productLines, line3);
        await testClient.AddEntity(productLines, line4);
        await testClient.AddEntity(productLines, line5);
        await testClient.AddEntity(productLines, line6);
        await testClient.AddEntity(productLines, line7);
        await testClient.AddEntity(productLines, line8);
        await testClient.AddEntity(productLines, line9);
        await testClient.AddEntity(productLines, line10);

        await testClient.AddUserToGroupMapping("user1", "group1");
        await testClient.AddUserToGroupMapping("user2", "group1");
        await testClient.AddUserToGroupMapping("user3", "group2");
        await testClient.AddUserToGroupMapping("user4", "group2");
        await testClient.AddUserToGroupMapping("user5", "group3");
        await testClient.AddUserToGroupMapping("user6", "group3");
        await testClient.AddUserToGroupMapping("user7", "group4");
        await testClient.AddUserToGroupMapping("user8", "group4");
        await testClient.AddUserToGroupMapping("user9", "group5");
        await testClient.AddUserToGroupMapping("user10", "group5");
        await testClient.AddUserToGroupMapping("user11", "group6");
        await testClient.AddUserToGroupMapping("user12", "group6");
        await testClient.AddUserToGroupMapping("unmappedUser1", "unmappedGroup1");

        await testClient.AddGroupToGroupMapping("group1", "group3");
        await testClient.AddGroupToGroupMapping("group1", "group4");
        await testClient.AddGroupToGroupMapping("group2", "group4");
        await testClient.AddGroupToGroupMapping("group3", "group5");
        await testClient.AddGroupToGroupMapping("group4", "group5");
        await testClient.AddGroupToGroupMapping("group4", "group6");
        await testClient.AddGroupToGroupMapping("unmappedGroup1", "unmappedGroup2");

        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user1", ApplicationScreen.Order, AccessLevel.View);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user1", ApplicationScreen.Order, AccessLevel.Create);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user2", ApplicationScreen.Order, AccessLevel.Modify);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user3", ApplicationScreen.Order, AccessLevel.Delete);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user4", ApplicationScreen.Summary, AccessLevel.View);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user5", ApplicationScreen.Summary, AccessLevel.Create);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user6", ApplicationScreen.Summary, AccessLevel.Modify);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user7", ApplicationScreen.Summary, AccessLevel.Delete);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user8", ApplicationScreen.ManageProducts, AccessLevel.View);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user9", ApplicationScreen.ManageProducts, AccessLevel.Create);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user10", ApplicationScreen.ManageProducts, AccessLevel.Modify);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user11", ApplicationScreen.ManageProducts, AccessLevel.Delete);
        await testClient.AddUserToApplicationComponentAndAccessLevelMapping("user12", ApplicationScreen.Settings, AccessLevel.View);

        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group1", ApplicationScreen.Settings, AccessLevel.Create);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group1", ApplicationScreen.Settings, AccessLevel.Modify);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group2", ApplicationScreen.Settings, AccessLevel.Delete);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group3", ApplicationScreen.Delivery, AccessLevel.View);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group4", ApplicationScreen.Delivery, AccessLevel.Create);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group5", ApplicationScreen.Delivery, AccessLevel.Modify);
        await testClient.AddGroupToApplicationComponentAndAccessLevelMapping("group6", ApplicationScreen.Delivery, AccessLevel.Delete);

        await testClient.AddUserToEntityMapping("user1", clientAccounts, company1);
        await testClient.AddUserToEntityMapping("user1", clientAccounts, company2);
        await testClient.AddUserToEntityMapping("user2", clientAccounts, company3);
        await testClient.AddUserToEntityMapping("user3", clientAccounts, company4);
        await testClient.AddUserToEntityMapping("user4", clientAccounts, company5);
        await testClient.AddUserToEntityMapping("user5", clientAccounts, company6);
        await testClient.AddUserToEntityMapping("user6", clientAccounts, company7);
        await testClient.AddUserToEntityMapping("user7", clientAccounts, company8);
        await testClient.AddUserToEntityMapping("user8", clientAccounts, company9);
        await testClient.AddUserToEntityMapping("user9", clientAccounts, company10);
        await testClient.AddUserToEntityMapping("user10", productLines, line1);
        await testClient.AddUserToEntityMapping("user11", productLines, line2);
        await testClient.AddUserToEntityMapping("user12", productLines, line3);

        await testClient.AddGroupToEntityMapping("group1", productLines, line4);
        await testClient.AddGroupToEntityMapping("group1", productLines, line5);
        await testClient.AddGroupToEntityMapping("group2", productLines, line6);
        await testClient.AddGroupToEntityMapping("group3", productLines, line7);
        await testClient.AddGroupToEntityMapping("group4", productLines, line8);
        await testClient.AddGroupToEntityMapping("group5", productLines, line9);
        await testClient.AddGroupToEntityMapping("group6", productLines, line10);
        await testClient.AddGroupToEntityMapping("group6", clientAccounts, company1);
    });


    it("Queries.", async() => {

        let allUsers: Array<String> = await testClient.GetUsers();
        expect(allUsers.length).toBe(14);
        expect(allUsers.includes("user1")).toBe(true);
        expect(allUsers.includes("user2")).toBe(true);
        expect(allUsers.includes("user3")).toBe(true);
        expect(allUsers.includes("user4")).toBe(true);
        expect(allUsers.includes("user5")).toBe(true);
        expect(allUsers.includes("user6")).toBe(true);
        expect(allUsers.includes("user7")).toBe(true);
        expect(allUsers.includes("user8")).toBe(true);
        expect(allUsers.includes("user9")).toBe(true);
        expect(allUsers.includes("user10")).toBe(true);
        expect(allUsers.includes("user11")).toBe(true);
        expect(allUsers.includes("user12")).toBe(true);
        expect(allUsers.includes("unmappedUser1")).toBe(true);
        expect(allUsers.includes("orphanedUser")).toBe(true);
        
        let allGroups: Array<String> = await testClient.GetGroups();
        expect(allGroups.length).toBe(9);
        expect(allGroups.includes("group1")).toBe(true);
        expect(allGroups.includes("group2")).toBe(true);
        expect(allGroups.includes("group3")).toBe(true);
        expect(allGroups.includes("group4")).toBe(true);
        expect(allGroups.includes("group5")).toBe(true);
        expect(allGroups.includes("group6")).toBe(true);
        expect(allGroups.includes("unmappedGroup1")).toBe(true);
        expect(allGroups.includes("unmappedGroup2")).toBe(true);
        expect(allGroups.includes("orphanedGroup")).toBe(true);
        
        let allEntityTypes: Array<String> = await testClient.GetEntityTypes();
        expect(allEntityTypes.length).toBe(3);
        expect(allEntityTypes.includes(clientAccounts)).toBe(true);
        expect(allEntityTypes.includes(productLines)).toBe(true);
        expect(allEntityTypes.includes(unmapped)).toBe(true);

        let containsResult: boolean = await testClient.ContainsUser("user1");
        expect(containsResult).toBe(true);
        containsResult = await testClient.ContainsUser("user99");
        expect(containsResult).toBe(false);

        containsResult = await testClient.ContainsGroup("group1");
        expect(containsResult).toBe(true);
        containsResult = await testClient.ContainsGroup("group99");
        expect(containsResult).toBe(false);

        let userToGroupMappings: Array<String> = await testClient.GetUserToGroupMappings("user5", false);
        expect(userToGroupMappings.length).toBe(1);
        expect(userToGroupMappings.includes("group3")).toBe(true);
        userToGroupMappings = await testClient.GetUserToGroupMappings("user5", true);
        expect(userToGroupMappings.length).toBe(2);
        expect(userToGroupMappings.includes("group3")).toBe(true);
        expect(userToGroupMappings.includes("group5")).toBe(true);
        userToGroupMappings = await testClient.GetUserToGroupMappings("orphanedUser", false);
        expect(userToGroupMappings.length).toBe(0);

        let groupToUserMappings: Array<String> = await testClient.GetGroupToUserMappings("group3", false);
        expect(groupToUserMappings.length).toBe(2);
        expect(groupToUserMappings.includes("user5")).toBe(true);
        expect(groupToUserMappings.includes("user6")).toBe(true);
        groupToUserMappings = await testClient.GetGroupToUserMappings("group3", true);
        expect(groupToUserMappings.length).toBe(4);
        expect(groupToUserMappings.includes("user1")).toBe(true);
        expect(groupToUserMappings.includes("user2")).toBe(true);
        expect(groupToUserMappings.includes("user5")).toBe(true);
        expect(groupToUserMappings.includes("user6")).toBe(true);
        groupToUserMappings = await testClient.GetGroupToUserMappings("orphanedGroup", false);
        expect(groupToUserMappings.length).toBe(0);

        let groupToGroupMappings: Array<String> = await testClient.GetGroupToGroupMappings("group2", false);
        expect(groupToGroupMappings.length).toBe(1);
        expect(groupToGroupMappings.includes("group4")).toBe(true);
        groupToGroupMappings = await testClient.GetGroupToGroupMappings("group2", true);
        expect(groupToGroupMappings.length).toBe(3);
        expect(groupToGroupMappings.includes("group4")).toBe(true);
        expect(groupToGroupMappings.includes("group5")).toBe(true);
        expect(groupToGroupMappings.includes("group6")).toBe(true);
        groupToGroupMappings = await testClient.GetGroupToGroupMappings("orphanedGroup", false);
        expect(groupToGroupMappings.length).toBe(0);

        let groupToGroupReverseMappings: Array<String> = await testClient.GetGroupToGroupReverseMappings("group6", false);
        expect(groupToGroupReverseMappings.length).toBe(1);
        expect(groupToGroupReverseMappings.includes("group4")).toBe(true);
        groupToGroupReverseMappings = await testClient.GetGroupToGroupReverseMappings("group6", true);
        expect(groupToGroupReverseMappings.length).toBe(3);
        expect(groupToGroupReverseMappings.includes("group1")).toBe(true);
        expect(groupToGroupReverseMappings.includes("group2")).toBe(true);
        expect(groupToGroupReverseMappings.includes("group4")).toBe(true);
        groupToGroupReverseMappings = await testClient.GetGroupToGroupReverseMappings("orphanedGroup", false);
        expect(groupToGroupReverseMappings.length).toBe(0);

        let userComponentMappings: Array<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetUserToApplicationComponentAndAccessLevelMappings("user5");
        expect(userComponentMappings.length).toBe(1);
        expect(IterableContainsApplicationComponentAndAccessLevel(userComponentMappings, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Summary, AccessLevel.Create))).toBe(true);
        userComponentMappings = await testClient.GetUserToApplicationComponentAndAccessLevelMappings("orphanedUser");
        expect(userComponentMappings.length).toBe(0);

        let users: Array<String> = await testClient.GetApplicationComponentAndAccessLevelToUserMappings(ApplicationScreen.Settings, AccessLevel.View, false);
        expect(users.length).toBe(1);
        expect(users.includes("user12")).toBe(true);
        users = await testClient.GetApplicationComponentAndAccessLevelToUserMappings(ApplicationScreen.Delivery, AccessLevel.View, true);
        expect(users.length).toBe(4);
        expect(users.includes("user1")).toBe(true);
        expect(users.includes("user2")).toBe(true);
        expect(users.includes("user5")).toBe(true);
        expect(users.includes("user6")).toBe(true);
        users = await testClient.GetApplicationComponentAndAccessLevelToUserMappings(ApplicationScreen.Delivery, AccessLevel.View, false);
        expect(users.length).toBe(0);

        let groupComponentMappings: Array<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetGroupToApplicationComponentAndAccessLevelMappings("group4");
        expect(groupComponentMappings.length).toBe(1);
        expect(IterableContainsApplicationComponentAndAccessLevel(groupComponentMappings, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Create))).toBe(true);
        groupComponentMappings = await testClient.GetGroupToApplicationComponentAndAccessLevelMappings("orphanedGroup");
        expect(groupComponentMappings.length).toBe(0);

        let groups: Array<String> = await testClient.GetApplicationComponentAndAccessLevelToGroupMappings(ApplicationScreen.Delivery, AccessLevel.View, false);
        expect(groups.length).toBe(1);
        expect(groups.includes("group3")).toBe(true);
        groups = await testClient.GetApplicationComponentAndAccessLevelToGroupMappings(ApplicationScreen.Delivery, AccessLevel.View, true);
        expect(groups.length).toBe(2);
        expect(groups.includes("group1")).toBe(true);
        expect(groups.includes("group3")).toBe(true);
        groups = await testClient.GetApplicationComponentAndAccessLevelToGroupMappings(ApplicationScreen.Summary, AccessLevel.View, false);
        expect(groups.length).toBe(0);

        containsResult = await testClient.ContainsEntityType(productLines);
        expect(containsResult).toBe(true);
        containsResult = await testClient.ContainsEntityType("Invalid");
        expect(containsResult).toBe(false);

        let entities: Array<String> = await testClient.GetEntities(productLines);
        expect(entities.length).toBe(10);
        expect(entities.includes(line1)).toBe(true);
        expect(entities.includes(line2)).toBe(true);
        expect(entities.includes(line3)).toBe(true);
        expect(entities.includes(line4)).toBe(true);
        expect(entities.includes(line5)).toBe(true);
        expect(entities.includes(line6)).toBe(true);
        expect(entities.includes(line7)).toBe(true);
        expect(entities.includes(line8)).toBe(true);
        expect(entities.includes(line9)).toBe(true);
        expect(entities.includes(line10)).toBe(true);
        entities = await testClient.GetEntities(unmapped);
        expect(entities.length).toBe(0);

        containsResult = await testClient.ContainsEntity(productLines, line1);
        expect(containsResult).toBe(true);
        containsResult = await testClient.ContainsEntity(productLines, "Invalid");
        expect(containsResult).toBe(false);

        let userEntityMappings: Array<EntityTypeAndEntity> = await testClient.GetUserToEntityMappings("user6");
        expect(userEntityMappings.length).toBe(1);
        expect(IterableContainsEntityTypeAndEntity(userEntityMappings, new EntityTypeAndEntity(clientAccounts, company7))).toBe(true);
        userEntityMappings = await testClient.GetUserToEntityMappings("orphanedUser");
        expect(userEntityMappings.length).toBe(0);

        entities = await testClient.GetUserToEntityMappingsForType("user3", clientAccounts);
        expect(entities.length).toBe(1);
        expect(entities.includes(company4)).toBe(true);
        entities = await testClient.GetUserToEntityMappingsForType("orphanedUser", clientAccounts);
        expect(entities.length).toBe(0);

        users = await testClient.GetEntityToUserMappings(clientAccounts, company1, false);
        expect(users.length).toBe(1);
        expect(users.includes("user1")).toBe(true);
        users = await testClient.GetEntityToUserMappings(clientAccounts, company1, true);
        expect(users.length).toBe(8);
        expect(users.includes("user1")).toBe(true);
        expect(users.includes("user2")).toBe(true);
        expect(users.includes("user3")).toBe(true);
        expect(users.includes("user4")).toBe(true);
        expect(users.includes("user7")).toBe(true);
        expect(users.includes("user8")).toBe(true);
        expect(users.includes("user11")).toBe(true);
        expect(users.includes("user12")).toBe(true);
        users = await testClient.GetEntityToUserMappings(productLines, line10, false);
        expect(users.length).toBe(0);

        let groupEntityMappings: Array<EntityTypeAndEntity> = await testClient.GetGroupToEntityMappings("group4");
        expect(groupEntityMappings.length).toBe(1);
        expect(IterableContainsEntityTypeAndEntity(groupEntityMappings, new EntityTypeAndEntity(productLines, line8))).toBe(true);
        groupEntityMappings = await testClient.GetGroupToEntityMappings("orphanedGroup");
        expect(groupEntityMappings.length).toBe(0);

        entities = await testClient.GetGroupToEntityMappingsForType("group2", productLines);
        expect(entities.length).toBe(1);
        expect(entities.includes(line6)).toBe(true);
        entities = await testClient.GetGroupToEntityMappingsForType("orphanedGroup", productLines);
        expect(entities.length).toBe(0);
        
        groups = await testClient.GetEntityToGroupMappings(clientAccounts, company1, false);
        expect(groups.length).toBe(1);
        expect(groups.includes("group6")).toBe(true);
        groups = await testClient.GetEntityToGroupMappings(clientAccounts, company1, true);
        expect(groups.length).toBe(4);
        expect(groups.includes("group1")).toBe(true);
        expect(groups.includes("group2")).toBe(true);
        expect(groups.includes("group4")).toBe(true);
        expect(groups.includes("group6")).toBe(true);
        groups = await testClient.GetEntityToGroupMappings(clientAccounts, company2, false);
        expect(groups.length).toBe(0);

        let hasAccessResult: boolean = await testClient.HasAccessToApplicationComponent("user1", ApplicationScreen.Order, AccessLevel.View);
        expect(hasAccessResult).toBe(true);
        hasAccessResult = await testClient.HasAccessToApplicationComponent("user12", ApplicationScreen.Order, AccessLevel.View);
        expect(hasAccessResult).toBe(false);

        hasAccessResult = await testClient.HasAccessToEntity("user1", clientAccounts, company1);
        expect(hasAccessResult).toBe(true);
        hasAccessResult = await testClient.HasAccessToEntity("user12", clientAccounts, company2);
        expect(hasAccessResult).toBe(false);

        let userComponentMappingsSet: Set<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetApplicationComponentsAccessibleByUser("user8");
        expect(userComponentMappingsSet.size).toBe(4);
        expect(IterableContainsApplicationComponentAndAccessLevel(userComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.ManageProducts, AccessLevel.View))).toBe(true);
        expect(IterableContainsApplicationComponentAndAccessLevel(userComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Create))).toBe(true);
        expect(IterableContainsApplicationComponentAndAccessLevel(userComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Delete))).toBe(true);
        expect(IterableContainsApplicationComponentAndAccessLevel(userComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Modify))).toBe(true);
        userComponentMappingsSet = await testClient.GetApplicationComponentsAccessibleByUser("orphanedUser");
        expect(userComponentMappingsSet.size).toBe(0);

        let groupComponentMappingsSet: Set<ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>> = await testClient.GetApplicationComponentsAccessibleByGroup("group4");
        expect(groupComponentMappingsSet.size).toBe(3);
        expect(IterableContainsApplicationComponentAndAccessLevel(groupComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Create))).toBe(true);
        expect(IterableContainsApplicationComponentAndAccessLevel(groupComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Delete))).toBe(true);
        expect(IterableContainsApplicationComponentAndAccessLevel(groupComponentMappingsSet, new ApplicationComponentAndAccessLevel<ApplicationScreen, AccessLevel>(ApplicationScreen.Delivery, AccessLevel.Modify))).toBe(true);
        groupComponentMappingsSet = await testClient.GetApplicationComponentsAccessibleByGroup("orphanedGroup");
        expect(groupComponentMappingsSet.size).toBe(0);

        let userEntityMappingsSet: Set<EntityTypeAndEntity> = await testClient.GetEntitiesAccessibleByUser("user5");
        expect(userEntityMappingsSet.size).toBe(3);
        expect(IterableContainsEntityTypeAndEntity(userEntityMappingsSet, new EntityTypeAndEntity(clientAccounts, company6))).toBe(true);
        expect(IterableContainsEntityTypeAndEntity(userEntityMappingsSet, new EntityTypeAndEntity(productLines, line7))).toBe(true);
        expect(IterableContainsEntityTypeAndEntity(userEntityMappingsSet, new EntityTypeAndEntity(productLines, line9))).toBe(true);
        userEntityMappingsSet = await testClient.GetEntitiesAccessibleByUser("orphanedUser");
        expect(userEntityMappingsSet.size).toBe(0);

        let entitiesSet: Set<String> = await testClient.GetEntitiesOfTypeAccessibleByUser("user5", productLines);
        expect(entitiesSet.size).toBe(2);
        expect(entitiesSet.has(line7)).toBe(true);
        expect(entitiesSet.has(line9)).toBe(true);
        entitiesSet = await testClient.GetEntitiesOfTypeAccessibleByUser("orphanedUser", productLines);
        expect(entitiesSet.size).toBe(0);

        let groupEntityMappingsSet: Set<EntityTypeAndEntity> = await testClient.GetEntitiesAccessibleByGroup("group4");
        expect(groupEntityMappingsSet.size).toBe(4);
        expect(IterableContainsEntityTypeAndEntity(groupEntityMappingsSet, new EntityTypeAndEntity(clientAccounts, company1))).toBe(true);
        expect(IterableContainsEntityTypeAndEntity(groupEntityMappingsSet, new EntityTypeAndEntity(productLines, line8))).toBe(true);
        expect(IterableContainsEntityTypeAndEntity(groupEntityMappingsSet, new EntityTypeAndEntity(productLines, line9))).toBe(true);
        expect(IterableContainsEntityTypeAndEntity(groupEntityMappingsSet, new EntityTypeAndEntity(productLines, line10))).toBe(true);
        groupEntityMappingsSet = await testClient.GetEntitiesAccessibleByGroup("orphanedGroup");
        expect(groupEntityMappingsSet.size).toBe(0);

        entitiesSet = await testClient.GetEntitiesOfTypeAccessibleByGroup("group4", productLines);
        expect(entitiesSet.size).toBe(3);
        expect(entitiesSet.has(line8)).toBe(true);
        expect(entitiesSet.has(line9)).toBe(true);
        expect(entitiesSet.has(line10)).toBe(true);
        entitiesSet = await testClient.GetEntitiesOfTypeAccessibleByGroup("orphanedGroup", productLines);
        expect(entitiesSet.size).toBe(0);
    });


    it("RemoveElementsAndMappings.", async() => {

        await testClient.RemoveGroupToEntityMapping("group6", clientAccounts, company1);
        await testClient.RemoveGroupToEntityMapping("group6", productLines, line10);
        await testClient.RemoveGroupToEntityMapping("group5", productLines, line9);
        await testClient.RemoveGroupToEntityMapping("group4", productLines, line8);
        await testClient.RemoveGroupToEntityMapping("group3", productLines, line7);
        await testClient.RemoveGroupToEntityMapping("group2", productLines, line6);
        await testClient.RemoveGroupToEntityMapping("group1", productLines, line5);
        await testClient.RemoveGroupToEntityMapping("group1", productLines, line4);

        await testClient.RemoveUserToEntityMapping("user12", productLines, line3);
        await testClient.RemoveUserToEntityMapping("user11", productLines, line2);
        await testClient.RemoveUserToEntityMapping("user10", productLines, line1);
        await testClient.RemoveUserToEntityMapping("user9", clientAccounts, company10);
        await testClient.RemoveUserToEntityMapping("user8", clientAccounts, company9);
        await testClient.RemoveUserToEntityMapping("user7", clientAccounts, company8);
        await testClient.RemoveUserToEntityMapping("user6", clientAccounts, company7);
        await testClient.RemoveUserToEntityMapping("user5", clientAccounts, company6);
        await testClient.RemoveUserToEntityMapping("user4", clientAccounts, company5);
        await testClient.RemoveUserToEntityMapping("user3", clientAccounts, company4);
        await testClient.RemoveUserToEntityMapping("user2", clientAccounts, company3);
        await testClient.RemoveUserToEntityMapping("user1", clientAccounts, company2);
        await testClient.RemoveUserToEntityMapping("user1", clientAccounts, company1);

        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group6", ApplicationScreen.Delivery, AccessLevel.Delete);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group5", ApplicationScreen.Delivery, AccessLevel.Modify);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group4", ApplicationScreen.Delivery, AccessLevel.Create);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group3", ApplicationScreen.Delivery, AccessLevel.View);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group2", ApplicationScreen.Settings, AccessLevel.Delete);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group1", ApplicationScreen.Settings, AccessLevel.Modify);
        await testClient.RemoveGroupToApplicationComponentAndAccessLevelMapping("group1", ApplicationScreen.Settings, AccessLevel.Create);

        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user12", ApplicationScreen.Settings, AccessLevel.View);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user11", ApplicationScreen.ManageProducts, AccessLevel.Delete);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user10", ApplicationScreen.ManageProducts, AccessLevel.Modify);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user9", ApplicationScreen.ManageProducts, AccessLevel.Create);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user8", ApplicationScreen.ManageProducts, AccessLevel.View);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user7", ApplicationScreen.Summary, AccessLevel.Delete);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user6", ApplicationScreen.Summary, AccessLevel.Modify);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user5", ApplicationScreen.Summary, AccessLevel.Create);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user4", ApplicationScreen.Summary, AccessLevel.View);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user3", ApplicationScreen.Order, AccessLevel.Delete);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user2", ApplicationScreen.Order, AccessLevel.Modify);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user1", ApplicationScreen.Order, AccessLevel.Create);
        await testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user1", ApplicationScreen.Order, AccessLevel.View);

        await testClient.RemoveGroupToGroupMapping("unmappedGroup1", "unmappedGroup2");
        await testClient.RemoveGroupToGroupMapping("group4", "group6");
        await testClient.RemoveGroupToGroupMapping("group4", "group5");
        await testClient.RemoveGroupToGroupMapping("group3", "group5");
        await testClient.RemoveGroupToGroupMapping("group2", "group4");
        await testClient.RemoveGroupToGroupMapping("group1", "group4");
        await testClient.RemoveGroupToGroupMapping("group1", "group3");

        await testClient.RemoveUserToGroupMapping("unmappedUser1", "unmappedGroup1");
        await testClient.RemoveUserToGroupMapping("user12", "group6");
        await testClient.RemoveUserToGroupMapping("user11", "group6");
        await testClient.RemoveUserToGroupMapping("user10", "group5");
        await testClient.RemoveUserToGroupMapping("user9", "group5");
        await testClient.RemoveUserToGroupMapping("user8", "group4");
        await testClient.RemoveUserToGroupMapping("user7", "group4");
        await testClient.RemoveUserToGroupMapping("user6", "group3");
        await testClient.RemoveUserToGroupMapping("user5", "group3");
        await testClient.RemoveUserToGroupMapping("user4", "group2");
        await testClient.RemoveUserToGroupMapping("user3", "group2");
        await testClient.RemoveUserToGroupMapping("user2", "group1");
        await testClient.RemoveUserToGroupMapping("user1", "group1");

        await testClient.RemoveEntity(productLines, line10);
        await testClient.RemoveEntity(productLines, line9);
        await testClient.RemoveEntity(productLines, line8);
        await testClient.RemoveEntity(productLines, line7);
        await testClient.RemoveEntity(productLines, line6);
        await testClient.RemoveEntity(productLines, line5);
        await testClient.RemoveEntity(productLines, line4);
        await testClient.RemoveEntity(productLines, line3);
        await testClient.RemoveEntity(productLines, line2);
        await testClient.RemoveEntity(productLines, line1);
        await testClient.RemoveEntity(clientAccounts, company10);
        await testClient.RemoveEntity(clientAccounts, company9);
        await testClient.RemoveEntity(clientAccounts, company8);
        await testClient.RemoveEntity(clientAccounts, company7);
        await testClient.RemoveEntity(clientAccounts, company6);
        await testClient.RemoveEntity(clientAccounts, company5);
        await testClient.RemoveEntity(clientAccounts, company4);
        await testClient.RemoveEntity(clientAccounts, company3);
        await testClient.RemoveEntity(clientAccounts, company2);
        await testClient.RemoveEntity(clientAccounts, company1);
        await testClient.RemoveEntityType(unmapped);
        await testClient.RemoveEntityType(productLines);
        await testClient.RemoveEntityType(clientAccounts);

        await testClient.RemoveGroup("orphanedGroup");
        await testClient.RemoveGroup("unmappedGroup2");
        await testClient.RemoveGroup("unmappedGroup1");
        await testClient.RemoveGroup("group6");
        await testClient.RemoveGroup("group5");
        await testClient.RemoveGroup("group4");
        await testClient.RemoveGroup("group3");
        await testClient.RemoveGroup("group2");
        await testClient.RemoveGroup("group1");

        await testClient.RemoveUser("orphanedUser");
        await testClient.RemoveUser("unmappedUser1");
        await testClient.RemoveUser("user12");
        await testClient.RemoveUser("user11");
        await testClient.RemoveUser("user10");
        await testClient.RemoveUser("user9");
        await testClient.RemoveUser("user8");
        await testClient.RemoveUser("user7");
        await testClient.RemoveUser("user6");
        await testClient.RemoveUser("user5");
        await testClient.RemoveUser("user4");
        await testClient.RemoveUser("user3");
        await testClient.RemoveUser("user2");
        await testClient.RemoveUser("user1");
    });
});

// #region Private/Protected Methods

/**
 * @name IterableContainsApplicationComponentAndAccessLevel
 * @desc Returns true if an {@link Iterable} of {@link ApplicationComponentAndAccessLevel} contains a specified element.
 * 
 * @template TComponent - The type of components in the AccessManager.
 * @template TAccess - The type of levels of access which can be assigned to an application component.
 * 
 * @param iterable - The iterate to search within.
 * @param element - The {@link ApplicationComponentAndAccessLevel} element to search for.
 */
function IterableContainsApplicationComponentAndAccessLevel<TComponent, TAccess>(iterable: Iterable<ApplicationComponentAndAccessLevel<TComponent, TAccess>>, element: ApplicationComponentAndAccessLevel<TComponent, TAccess>) : boolean {

    for (let currentElement of iterable) {
        if (currentElement.ApplicationComponent === element.ApplicationComponent && currentElement.AccessLevel === element.AccessLevel) {
            return true;
        }
    }

    return false;
}

/**
 * @name IterableContainsEntityTypeAndEntity
 * @desc Returns true if an {@link Iterable} of {@link EntityTypeAndEntity} contains a specified element.
 * 
 * @param iterable - The iterate to search within.
 * @param element - The {@link EntityTypeAndEntity} element to search for.
 */
function IterableContainsEntityTypeAndEntity(iterable: Iterable<EntityTypeAndEntity>, element: EntityTypeAndEntity) : boolean {

    for (let currentElement of iterable) {
        if (currentElement.EntityType === element.EntityType && currentElement.Entity === element.Entity) {
            return true;
        }
    }

    return false;
}

//#endregion

//#region Nested Classes

/**
 * @name ApplicationScreenStringifier
 * @desc Implementation of {@link IUniqueStringifier} for {@link ApplicationScreen | ApplicationScreens}.
 */
class ApplicationScreenStringifier implements IUniqueStringifier<ApplicationScreen> {

    ToString(inputObject: ApplicationScreen): string {
        
        return inputObject.toString();
    }
    FromString(stringifiedObject: string): ApplicationScreen {
        
        return ApplicationScreen[stringifiedObject as keyof typeof ApplicationScreen];
    }
}

/**
 * @name AccessLevelStringifier
 * @desc Implementation of {@link IUniqueStringifier} for {@link AccessLevel | AccessLevel} .
 */
class AccessLevelStringifier implements IUniqueStringifier<AccessLevel> {

    ToString(inputObject: AccessLevel): string {
        
        return inputObject.toString();
    }
    FromString(stringifiedObject: string): AccessLevel {
        
        return AccessLevel[stringifiedObject as keyof typeof AccessLevel];
    }
}

/**
 * @name CallCountingStringUniqueStringifier
 * @desc Subclass of {@link StringUniqueStringifier} which counts the number of calls to its public methods.
 */
class CallCountingStringUniqueStringifier extends StringUniqueStringifier {

    /** The number of times the ToString() method has been called. */
    protected toStringCount: number;
    /** The number of times the FromString() method has been called. */
    protected fromStringCount: number;

    /**
     * @returns The number of times the ToString() method has been called.
     */
    get ToStringCount(): number {

        return this.toStringCount;
    }

    /**
     * @returns The number of times the FromString() method has been called.
     */
    get FromStringCount(): number {

        return this.fromStringCount;
    }

    /** @inheritdoc */
    public override ToString(inputObject: string): string {
        
        this.toStringCount++;
        return super.ToString(inputObject);
    }

    /** @inheritdoc */
    public override FromString(stringifiedObject: string): string {
        
        this.fromStringCount++;
        return super.FromString(stringifiedObject);
    }
}

//#endregion