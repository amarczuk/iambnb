var moment  = require('moment'),
    assert  = require('assert'),
    should  = require('should'),
    helpers = require('./helpers'),
    app     = helpers.getLoopbackApp();

suite( "availability validation", function() {
  
    beforeEach(function (done) {
        helpers.clearAll(done);
    }); 

    afterEach(function (done) {
        helpers.clearAll(done);
    }); 

    test( "insert availability", function(done){
        var validDates = {start: '2016-02-01', end: '2017-01-01'};
    
        helpers.insertProperty( 'test property', function(property) {
            helpers.insertAvailability(property.id, validDates.start, validDates.end, 200, function(availability) { 
                availability.start.should.containEql(validDates.start);
                availability.end.should.containEql(validDates.end);
                done();
            });
        });
    });

    test( "do not insert if start > end", function(done){
        var invalidDates = {start: '2016-02-01', end: '2016-01-01'};
    
        helpers.insertProperty( 'test property', function(property) {
            helpers.insertAvailability(property.id, invalidDates.start, invalidDates.end, 422, function(availability) { 
                availability.error.name.should.equal('ValidationError');
                availability.error.details.messages.start[0].should.equal('End date must be after start date');
                done();
            });
        });
    });


});
