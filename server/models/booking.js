
var moment = require('moment');

module.exports = function(Booking) {
    
    var availabilityValidator = function(err, done) {
        var availability = Booking.app.models.availability,
            filter = {where: {and: [
                                    {propertyId: this.propertyId},
                                    {start: {lte: this.start}},
                                    {end: {gte: this.end}}
                                    ]
                             }
                     };

        availability.find(filter, function(error, records) {
            if (records.length == 0) err();
            done();
        });
    };

    var overlapValidator = function(err, done) {
        var booking = Booking.app.models.booking,
            filter = {where: {and: [
                                    {propertyId: this.propertyId},
                                    {or: [
                                        {start: {between: [this.start, this.end]}},
                                        {end: {between: [this.start, this.end]}},
                                        {and: [{end: {gte: this.end}},
                                               {start: {lte: this.start}}
                                              ]},
                                        ] }
                                    ]
                             }
                     };

        booking.find(filter, function(error, bookings) {
            if (bookings.length > 0) err();
            done();
        });
    };

    var dateValidator = function(err) {
        if ( moment(this.start).isAfter(this.end) ) err();
    };

    Booking.validatesPresenceOf('propertyId');
    Booking.validate('start', dateValidator, {message: 'End date must be after start date'});
    Booking.validateAsync('start', availabilityValidator, {message: 'Property is not available during this period'});
    Booking.validateAsync('start', overlapValidator, {message: 'Property is booked during this period'});
};
