 appointments = require('./../controllers/appointments');

module.exports = function(app) {
	// appointments
	app.get('/appointments', function (req,res) {
		appointments.show(req,res);
	});

	app.post('/appointments/new', function (req,res) {
		appointments.create(req,res);
	});

	app.post('/appointments/destroy', function (req,res) {
		appointments.destroy(req,res);
	});
}