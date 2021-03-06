'use strict';
let assert = require('assert');
let waitersFunctions = require('../services/waiters-functions');
const pg = require('pg');
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:1234@localhost:5432/weekly_planning';

const pool = new Pool({
    connectionString
});

describe('It should store names of the waiters', function () {
    beforeEach(async function () {
        await pool.query('DELETE FROM waiters');
        await pool.query('DELETE FROM days_booked');
    });
    it('Add a name to the database', async () => {
        let waitersData = waitersFunctions(pool);
        await waitersData.waitersNames('Ntando');
        let allNames = await pool.query('SELECT * FROM waiters');
        assert.equal(allNames.rows[0].names, 'Ntando');
    });
    it('Add names to the database', async () => {
        let waitersData = waitersFunctions(pool);
        await waitersData.waitersNames('Yawa, Zinzi, Lungi, Vuyo');
        let allNames = await pool.query('SELECT * FROM waiters');
        assert.equal(allNames.rows[0].names, 'Yawa, Zinzi, Lungi, Vuyo');
    });
    it('Return days that has been booked by the waiter', async () => {
        let waitersData = waitersFunctions(pool);
        await waitersData.getWeekDays();
        await waitersData.waitersNames('Ntando');
        await waitersData.bookingOfDays('Ntando', ['Monday', 'Tuesday']);
        let booked = await waitersData.waitersNames('Ntando');
        assert.deepEqual(booked, [ { id: 1, weekday: 'Monday', checked: 'checked' },
            { id: 2, weekday: 'Tuesday', checked: 'checked' },
            { id: 3, weekday: 'Wednesday' },
            { id: 4, weekday: 'Thursday' },
            { id: 5, weekday: 'Friday' },
            { id: 6, weekday: 'Saturday' },
            { id: 7, weekday: 'Sunday' }]);
    });
    // it('Show all the days booked by the waiters ', async () => {
    //     let waitersData = waitersFunctions(pool);
    //     await waitersData.getWeekDays();
    //     await waitersData.waitersNames('Ntando');
    //     await waitersData.waitersNames('Tido');
    //     await waitersData.bookingOfDays('Ntando', ['Monday', 'Tuesday']);
    //     await waitersData.bookingOfDays('Tido', ['Wednesday', 'Friday']);
    //     await waitersData.waitersNames('Ntando');
    //     await waitersData.waitersNames('Tido');
    //     let admin = await waitersData.admin();
    //     assert.deepEqual(admin, [
    //         { id: 1, weekday: 'Monday', waiter: [ { 'names': 'Ntando' } ], color: 'orange' },
    //         { id: 2, weekday: 'Tuesday', waiter: [ { 'names': 'Ntando' } ], color: 'orange' },
    //         { id: 3, weekday: 'Wednesday', waiter: [ { 'names': 'Tido' } ], color: 'orange' },
    //         { id: 4, weekday: 'Thursday', waiter: [], color: 'crimson' },
    //         { id: 5, weekday: 'Friday', waiter: [ { 'names': 'Tido' } ], color: 'orange' },
    //         { id: 6, weekday: 'Saturday', waiter: [], color: 'crimson' },
    //         { id: 7, weekday: 'Sunday', waiter: [], color: 'crimson' }]);
    // });
    // it('Add colour crimson for the overbooking or no booking, orange below 3 booked waiters and green for 3 booked waiters', async () => {
    //     let waitersData = waitersFunctions(pool);
    //     await waitersData.getWeekDays();
    //     await waitersData.waitersNames('Andrew');
    //     await waitersData.waitersNames('Yegan');
    //     await waitersData.waitersNames('Busisele');
    //     await waitersData.waitersNames('Sbu');
    //     await waitersData.bookingOfDays('Andrew', ['Monday', 'Tuesday', 'Friday']);
    //     await waitersData.bookingOfDays('Yegan', ['Monday', 'Friday']);
    //     await waitersData.bookingOfDays('Busisele', ['Monday', 'Friday']);
    //     await waitersData.bookingOfDays('Sbu', ['Friday']);
    //     await waitersData.waitersNames('Andrew');
    //     await waitersData.waitersNames('Yegan');
    //     await waitersData.waitersNames('Busisele');
    //     await waitersData.waitersNames('Sbu');
    //     let admin = await waitersData.admin();
    //     assert.deepEqual(admin, [
    //         { id: 1, weekday: 'Monday', waiter: [ { 'names': 'Andrew' }, { 'names': 'Busisele' }, { 'names': 'Yegan' } ], color: 'green' },
    //         { id: 2, weekday: 'Tuesday', waiter: [ { 'names': 'Andrew' } ], color: 'orange' },
    //         { id: 3, weekday: 'Wednesday', waiter: [], color: 'crimson' },
    //         { id: 4, weekday: 'Thursday', waiter: [], color: 'crimson' },
    //         { id: 5, weekday: 'Friday', waiter: [ { 'names': 'Andrew' }, { 'names': 'Busisele' }, { 'names': 'Sbu' }, { 'names': 'Yegan' } ], color: 'crimson' },
    //         { id: 6, weekday: 'Saturday', waiter: [], color: 'crimson' },
    //         { id: 7, weekday: 'Sunday', waiter: [], color: 'crimson' }]);
    // });

    after(function () {
        pool.end();
    });
});
