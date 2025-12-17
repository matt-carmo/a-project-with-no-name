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

test('Should create a complements ', async () => {
    const createGroupComplements = await app.inject({
        method: 'POST',
        url: 'cmj64vndd0000xz6oag3ultnf/complement-groups/cmj8r0pv30000wz6ozz6lw9ya/complements',
        payload: createGroupComplementInput.complements,
        headers: HEADER,
    })

    const response = createGroupComplements
    const data = await response


    console.log('DATA', data)
    expect(response.statusCode).toBe(201)

})
