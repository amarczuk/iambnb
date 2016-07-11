var moment  = require('moment'),
    assert  = require('assert'),
    should  = require('should'),
    helpers = require('./helpers'),
    app     = helpers.getLoopbackApp();

suite( "booking validation", function() {

    beforeEach(function (done) {
        helpers.clearAll(done);
    }); 

    afterEach(function (done) {
        helpers.clearAll(done);
    }); 

    test( "insert valid bookings", function(done){
        var validDates = [
            {start: '2016-01-01', end: '2016-03-01'},
            {start: '2016-03-02', end: '2016-03-20'},
            {start: '2016-05-01', end: '2016-10-10'}
        ]
        helpers.insertProperty( 'test property', function(property) {
            
            assert.equal( property.address, 'test property' );
            helpers.insertAvailability(property.id, '2015-01-01', '2017-01-01', 200, function(availability) { 
                var valid = 0;
                validDates.forEach(function(dates, idx){
                    helpers.insertBooking(property.id, dates.start, dates.end, 200, function(booking){
                        valid++;
                        booking.start.should.containEql(dates.start);
                        booking.end.should.containEql(dates.end);
                        if ( valid == validDates.length ) {
                            done();
                        }
                    });
                });
            });
        });
    });

    test( "do not insert if already booked", function(done){
        var validDates = {start: '2016-02-01', end: '2016-04-01'},
            invalidDates = [
                {start: '2016-01-01', end: '2016-03-01'},
                {start: '2016-02-01', end: '2016-03-20'},
                {start: '2016-03-01', end: '2016-04-01'},
                {start: '2016-03-01', end: '2016-10-10'},
                {start: '2016-01-01', end: '2016-10-10'},
                {start: '2016-02-01', end: '2016-04-01'}
            ];
        helpers.insertProperty( 'test property', function(property) {
            helpers.insertAvailability(property.id, '2015-01-01', '2017-01-01', 200, function(availability) { 
                var count = 0;
                helpers.insertBooking(property.id, validDates.start, validDates.end, 200, function(validBooking) {
                    invalidDates.forEach(function(dates, idx){
                        helpers.insertBooking(property.id, dates.start, dates.end, 422, function(booking){
                            count++;
                            booking.error.name.should.equal('ValidationError');
                            booking.error.details.messages.start[0].should.equal('Property is booked during this period');
                            if ( count == invalidDates.length ) {
                                done();
                            }
                        });
                    });
                });
            });
        });
    });

    test( "do not insert if not available", function(done){
        var validDates = {start: '2016-02-01', end: '2016-04-01'},
            invalidDates = [
                {start: '2016-01-01', end: '2016-03-01'},
                {start: '2016-03-01', end: '2016-04-02'},
                {start: '2016-03-01', end: '2016-10-10'},
                {start: '2016-01-01', end: '2016-10-10'}
            ];
        helpers.insertProperty( 'test property', function(property) {
            helpers.insertAvailability(property.id, validDates.start, validDates.end, 200, function(availability) { 
                var count = 0;
                invalidDates.forEach(function(dates, idx){
                    helpers.insertBooking(property.id, dates.start, dates.end, 422, function(booking){
                        count++;
                        booking.error.name.should.equal('ValidationError');
                        booking.error.details.messages.start[0].should.equal('Property is not available during this period');
                        if ( count == invalidDates.length ) {
                            done();
                        }
                    });
                });
            });
        });
    });

    test( "do not insert if start > end", function(done){
        var invalidDates = {start: '2016-02-01', end: '2016-01-01'};
    
        helpers.insertProperty( 'test property', function(property) {

            var count = 0;
            helpers.insertBooking(property.id, invalidDates.start, invalidDates.end, 422, function(booking) { 
                booking.error.name.should.equal('ValidationError');
                booking.error.details.messages.start[0].should.equal('End date must be after start date');
                done();
            });
        });
    });

});
