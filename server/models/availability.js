var moment = require('moment');

module.exports = function(Availability) {
    var dateValidator = function(err) {
        if ( moment(this.start).isAfter(this.end) ) err();
    };

    Availability.validatesPresenceOf('propertyId');
    Availability.validate('start', dateValidator, {message: 'End date must be after start date'});
};
