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
    const clientAccount: string = "ClientAccount";
    const company1: string = "Company1";
    const company2: string = "Company2";
    const company3: string = "Company3";
    const company4: string = "Company4";
    const company5: string = "Company5";
    const company6: string = "Company6";
    const company7: string = "Company7";
    const company8: string = "Company8";
    const company9: string = "Company9";
    const company10: string = "Company10";
    const productLines: string = "ProductLines";
    const line1: string = "Line1";
    const line2: string = "Line2";
    const line3: string = "Line3";
    const line4: string = "Line4";
    const line5: string = "Line5";
    const line6: string = "Line6";
    const line7: string = "Line7";
    const line8: string = "Line8";
    const line9: string = "Line9";
    const line10: string = "Line10";
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
            // new URL("http://127.0.0.1:5170/"), 
            new URL("http://192.168.0.253:5000/"), 
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
});

//#region Nested Classes

/**
 * @name ApplicationScreenStringifier
 * @desc Implementation of {@link IUniqueStringifier} for {@link ApplicationScreen | ApplicationScreens} .
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