import { expect, test } from 'vitest'
import { buildServer } from '../../server'

const createGroupComplementInput = {
    id: 'hajce79',
    minSelected: 0,
    maxSelected: 4,
    name: 'Groups',
    isAvailable: true,
    complements: [
        {
            name: 'Groups',
            price: 1222,
            photoUrl: null,
        },
        {
            name: 'Coca',
            price: 0,
            photoUrl: null,
        },
    ],
}

const HEADER = {
    authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWo2NGw0ODQwMDAwbHg2b3lhZXgwM3JyIiwiZW1haWwiOiJtYXRoZXVzMjAxOGlAZ21haWwuY29tIiwiaWF0IjoxNzY1NzQxOTkyfQ.ijKahOmTa9SWoqV-JRjxNSFen1R0YcjNYfyukJYEHh0',
}

const app = buildServer()

test('Should create a group complement with complement items', async () => {
    const createGroupComplements = await app.inject({
        method: 'POST',
        url: 'cmj64vndd0000xz6oag3ultnf/groups-complements/cmj7b1yok0004fl6ogw52n40t',
        payload: [createGroupComplementInput],
        headers: HEADER,
    })

    const response = createGroupComplements
    const data = await response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(String),
                name: 'Groups',
                isAvailable: true,
                minSelected: 0,
                maxSelected: 4,
            }),
        ])
    )

    const findCreatedGroupComplements = await app.inject({
        method: 'GET',
        url: 'cmj64vndd0000xz6oag3ultnf/groups-complements?productId=cmj7b1yok0004fl6ogw52n40t',
        headers: HEADER,
    })

    const group = findCreatedGroupComplements
        .json()
        .find((group: any) => group.id === data[0].id)

    expect(group).toEqual(
        expect.objectContaining({
            id: data[0].id,
            name: 'Groups',
            isAvailable: true,
            minSelected: 0,
            maxSelected: 4,
            complements: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    name: 'Groups',
                    price: 1222,
                    photoUrl: null,
                }),
                expect.objectContaining({
                    id: expect.any(String),
                    name: 'Coca',
                    price: 0,
                    photoUrl: null,
                }),
            ]),
        })
    )
})
test('Should update a group complement', async () => {
    const storeId = 'cmj64vndd0000xz6oag3ultnf'
    const productId = 'cmj7b1yok0004fl6ogw52n40t'

    const createResponse = await app.inject({
        method: 'POST',
        url: `${storeId}/groups-complements/${productId}`,
        headers: HEADER,
        payload: [
            {
                name: 'Group to update',
                minSelected: 1,
                maxSelected: 3,
                isAvailable: true,
                complements: [
                    {
                        name: 'Item 1',
                        price: 10,
                        photoUrl: null,
                    },
                ],
            },
        ],
    })

    expect(createResponse.statusCode).toBe(201)

    const [createdGroup] = createResponse.json()
    const groupId = createdGroup.id
    
    const updateResponse = await app.inject({
        method: 'PUT',
        url: `/${storeId}/groups-complements/${groupId}`,
        headers: HEADER,
        payload: {
            name: 'Updated Group Name',
            minSelected: 2,
            maxSelected: 4,
            isAvailable: false,
        },
    })

    expect(updateResponse.statusCode).toBe(200)    
    const updatedGroup = updateResponse.json()
    
    expect(updatedGroup).toEqual(
        expect.objectContaining({
            id: groupId,
            name: 'Updated Group Name',
            minSelected: 2,
            maxSelected: 4,
            isAvailable: false,
        })
    )
    
})
test('Should delete a group complement', async () => {
    const storeId = 'cmj64vndd0000xz6oag3ultnf'
    const productId = 'cmj7b1yok0004fl6ogw52n40t'

    const createResponse = await app.inject({
        method: 'POST',
        url: `${storeId}/groups-complements/${productId}`,
        headers: HEADER,
        payload: [
            {
                name: 'Group to delete',
                minSelected: 0,
                maxSelected: 2,
                isAvailable: true,
                complements: [
                    {
                        name: 'Item 1',
                        price: 10,
                        photoUrl: null,
                    },
                ],
            },
        ],
    })

    expect(createResponse.statusCode).toBe(201)

    const [createdGroup] = createResponse.json()
    const groupId = createdGroup.id

    // 2️⃣ Delete the group complement
    const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/${storeId}/products/${productId}/groups-complements/${groupId}`,
        headers: HEADER,
    })

    expect(deleteResponse.statusCode).toBe(204)
    
})
