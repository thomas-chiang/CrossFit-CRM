require('dotenv').config();
const {expect, requester} = require('./set_up');
const {users} = require('./fake_data');



describe('user', () => {

    /**
     * Native Sign In
     */

    it('gym owner sign in with correct password', async () => {
        const user1 = users[0];
        
        const user = {
            role: user1.role,
            email: user1.email,
            password: user1.password
        };

        const res = await requester
            .post('/api/user/signin')
            .send(user);

        const data = res.body;

        const userExpect = {
            id: data.user.id, // need id from returned data
            name: user1.name,
            email: user1.email,
            role: 3,
        };


        expect(data.user).to.include(userExpect);
        expect(data.access_token).to.be.a("string")

    });


    it('member sign in with correct password', async () => {
        const user2 = users[1];
        
        const user = {
            role: user2.role,
            email: user2.email,
            password: user2.password
        };

        const res = await requester
            .post('/api/user/signin')
            .send(user);

        const data = res.body;

        const userExpect = {
            id: data.user.id, // need id from returned data
            name: user2.name,
            email: user2.email,
            role: 1,
        };

        expect(data.user).to.include(userExpect)
        expect(data.access_token).to.be.a("string")
    });

});