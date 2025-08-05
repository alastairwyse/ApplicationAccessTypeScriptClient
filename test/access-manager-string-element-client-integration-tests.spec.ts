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
import { AccessManagerStringElementClient } from '../src/access-manager-string-element-client';

/**
 * @desc Integration tests for the AccessManagerStringElementClient class.
 */
describe("AccessManagerStringElementClient Integration Tests", () => {

    let testClient: AccessManagerStringElementClient;

    beforeEach(() => {
        testClient = new AccessManagerStringElementClient(
            new URL("http://127.0.0.1:5170/")
        );
    });

            
    afterEach(() => { 
    });

    it("TestAddQueryRemoveElementsAndMappings.", async() => {

        testClient.AddUser("user1");
        testClient.AddGroup("group1");
        testClient.AddUserToApplicationComponentAndAccessLevelMapping("user1", "order", "view");

        let allUsers: Array<String> = await testClient.GetUsers();
        expect(allUsers.length).toBe(1);
        expect(allUsers.includes("user1")).toBe(true);

        let allGroups: Array<String> = await testClient.GetGroups();
        expect(allGroups.length).toBe(1);
        expect(allGroups.includes("group1")).toBe(true);

        let userComponentMappings: Array<ApplicationComponentAndAccessLevel<String, String>> = await testClient.GetUserToApplicationComponentAndAccessLevelMappings("user1");
        expect(userComponentMappings.length).toBe(1);
        expect(IterableContainsApplicationComponentAndAccessLevel(userComponentMappings, new ApplicationComponentAndAccessLevel<string, string>("order", "view"))).toBe(true);
        
        testClient.RemoveUserToApplicationComponentAndAccessLevelMapping("user1", "order", "view");
        testClient.RemoveGroup("group1");
        testClient.RemoveUser("user1");
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

//#endregion