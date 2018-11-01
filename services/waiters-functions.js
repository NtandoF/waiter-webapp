'use strict';
module.exports = (pool) => {
    const getWeekDays = async () => {
        let days = await pool.query('SELECT * FROM weekdays');
        return days.rows;
    };

    const waitersNames = async (name) => {
        let days = await getWeekDays();
        //console.log(days);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let nameExists = await pool.query('Select 1 from waiters WHERE names = $1', [name]);
        if (nameExists.rows.length === 0) {
            await pool.query('INSERT INTO waiters(names) VALUES($1)', [name]);
            return days;
        } else if (nameExists.rows.length === 1) {
            let waiterDays = await pool.query('SELECT waiters.names, weekdays.weekday FROM days_booked INNER JOIN waiters ON days_booked.name_id = waiters.id INNER JOIN weekdays ON days_booked.daybooked_id = weekdays.id where names=$1', [name]);
            console.log(waiterDays.rows);
            
            let waitershift = waiterDays.rows;
            for (let weekday of days) {
                for (let shiftDays of waitershift) {
                    if (weekday.weekday === shiftDays.weekday) {
                        weekday.checked = 'checked';
                    }
                }
            }

            return days;
        }
    };

    const bookingOfDays = async (enteredName, scheduleday) => {
        enteredName = enteredName.charAt(0).toUpperCase() + enteredName.slice(1);
        let waiter = await pool.query('SELECT * FROM waiters where names = $1', [enteredName]);
        let userID = waiter.rows[0].id;
        // console.log(userID);

        if (userID) {
            await pool.query('DELETE FROM days_booked WHERE name_id=$1', [userID]);
        }
        for (let dayId of scheduleday) {
            if (dayId) {
                let foundId = await pool.query('SELECT id From weekdays WHERE weekday=$1', [dayId]);
                await pool.query('INSERT INTO days_booked(name_id, daybooked_id) VALUES($1,$2)', [userID, foundId.rows[0].id]);
            } else {
                return;
            }
        }
    };

    const checkWaiter = async (enteredName) => {
        enteredName = enteredName.charAt(0).toUpperCase() + enteredName.slice(1);
        let waiter = await pool.query('Select 1 from waiters WHERE names = $1', [enteredName]);
        if (waiter.rows.length === 0) {
            return 'welcome';
        } else if (waiter.rows.length === 1) {
            return 'exist';
        }
    };

    const reset = async () => {
        let resetSchedule = await pool.query('DELETE FROM waiters');
        return resetSchedule.rows;
    };

    return {
        waitersNames,
        bookingOfDays,
        getWeekDays,
        checkWaiter,
        reset
    };
};
