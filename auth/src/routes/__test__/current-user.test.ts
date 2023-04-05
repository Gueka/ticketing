import request from 'supertest';
import {app} from '../../app';
/*
it('response with details about the current user', async () => {
    // signup declared global in /test/setup.ts file
    
    const cookie = await global.signin();
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);
    
    expect(response.body.currentUser.email).toEqual('test@test.com');
    
});
*/
it('response with null if not authentificated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    
    expect(response.body.currentUser).toEqual(null);
});