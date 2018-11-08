'use strict';
module.exports = (waiterServices) => {
    const bookingOfDays = async (req, res, next) => {
        try {
            let username = req.params.username;
            let days = Array.isArray(req.body.day) ? req.body.day : [req.body.day];
            let message = await waiterServices.bookingOfDays(username, days);
            if (message) {
                req.flash('updated', message);
            }
            res.redirect('/waiters/' + username);
        } catch (err) {
            next(err.stack);
        }
    };

    const getBookingOfDays = async (req, res, next) => {
        try {
            let username = req.params.username;
            // await waiterServices.waitersNames(username);
            let checkwaiter = await waiterServices.checkWaiter(username);
            if (checkwaiter === 'welcome') {
                req.flash('greet', `Welcome ${username} please select the days you want to book`);
            } else if (checkwaiter === 'exist') {
                req.flash('greet', `${username} here are the days you have`);
            } else {
                req.flash('greet', `${username} here are the days that you have updated`);
            }
            let displayDays = await waiterServices.waitersNames(username);
            res.render('waiters', { username, displayDays });
        } catch (err) {
            next(err.stack);
        }
    };
    const showAllShifts = async (req, res, next) => {
        try {
            let allShifts = await waiterServices.admin();
            // console.log('all shifts', allShifts);
            res.render('days', { allShifts });
        } catch (err) {
            next(err.stack);
        }
    };

    const goToHome = async (req, res, next) => {
        try {
            res.render('home');
        } catch (err) {
            next(err.stack);
        }
    };
    const clear = async (req, res, next) => {
        try {
            await waiterServices.reset();
            res.redirect('/days');
        } catch (err) {
            next(err.stack);
        }
    };

    return {
        bookingOfDays,
        showAllShifts,
        getBookingOfDays,
        goToHome,
        clear
    };
};
