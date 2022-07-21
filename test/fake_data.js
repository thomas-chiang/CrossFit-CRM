const moment = require('moment')

const users = [
    {
        name: 'Thomas',
        email: 'owner@email.com',
        password: 'owner',
        role: 3,
        gender: 1,
        valid: 1
    },
    {
        name: 'Authur',
        email: 'authur@email.com',
        password: 'authur',
        role: 1,
        gender: 1,
        valid: 1
    },
    {
        name: 'John',
        email: 'john@email.com',
        password: 'john',
        role: 2,
        gender: 1,
        valid: 1
    }
];

const courses = [
    {
        title: `Course1 at ${moment().add(2, 'days').format("MM/DD HH:mm")}`,
        size: 8,
        start: moment().add(2, 'days').format("YYYY-MM-DD HH:mm"),
        end: moment().add(2, 'days').add(1, 'hours').format("YYYY-MM-DD HH:mm"), 
        note: 'some note',
        point: 1      
    },
    {
        title: `Course2 at ${moment().add(2, 'days').add(1, 'hours').format("MM/DD HH:mm")}`,
        size: 8,
        start: moment().add(2, 'days').add(1, 'hours').format("YYYY-MM-DD HH:mm"),
        end: moment().add(2, 'days').add(2, 'hours').format("YYYY-MM-DD HH:mm"), 
        note: 'some note',
        point: 1      
    }
]

const movements = [
    {
        name: 'Run',
        demo_link: 'https://www.youtube.com/watch?v=NhXSuyklE48&ab_channel=XPollinationProductions'    
    },
    {
        name: 'Sit up',
        demo_link: 'https://www.youtube.com/watch?v=VIZX2Ru9qU8&ab_channel=CrossFit%C2%AE'    
    },
    {
        name: 'Bench Press',
        demo_link: 'https://www.youtube.com/watch?v=SCVCLChPQFY&ab_channel=CrossFit%C2%AE'    
    },
]

const workouts = [
    {
        name: 'crossfit basic',
        round: 5,
        extra_count: 0,
        minute: 30,
        extra_sec: 0,
        note: '',
    }
]

const performance = {
    kg: 1,
    rep: 1,
    meter: 1,
    cal: 1,
    round: 1,
    minute: 1,
    extra_count: 1,
    extra_sec: 1
}


module.exports = {
    users,
    courses,
    movements,
    workouts,
    performance
}

