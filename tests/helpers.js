var request = require('supertest'),
    app     = require('../server/server'),
    server  = null;

exports.getLoopbackApp = function() {
    if ( server ) return app;
    server = app.start();
    return app;
};

exports.insertProperty = function(propertyName, done) {

    request('http://localhost:3000')
        .post('/api/properties')
        .send({address:propertyName})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8' )
        .end(function(error, result) {
            if (error) {
                throw error;
            }
            done(result.body);
        });
};

exports.insertBooking = function(propertyId, start, end, status, done) {

    request('http://localhost:3000')
        .post('/api/properties/' + propertyId + '/bookings')
        .send({start: start, end: end})
        .expect(status)
        .expect('Content-Type', 'application/json; charset=utf-8' )
        .end(function(error, result) {
            if (error) {
                throw error;
            }
            done(result.body);
        });
};

exports.insertAvailability = function(propertyId, start, end, status, done) {

    request('http://localhost:3000')
        .post('/api/properties/' + propertyId + '/availability')
        .send({start: start, end: end})
        .expect(status)
        .expect('Content-Type', 'application/json; charset=utf-8' )
        .end(function(error, result) {
            if (error) {
                throw error;
            }
            done(result.body);
        });
};

exports.clearAll = function(done) {
    app.models.property.destroyAll(function() {
        app.models.booking.destroyAll(function() {
            app.models.availability.destroyAll(done);
        });
    });
}