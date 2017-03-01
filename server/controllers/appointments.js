var mongoose = require('mongoose');
var Appointment = mongoose.model('Appointment');

module.exports = (function () {
	return {
		show: function(req,res) {
			Appointment.find({}, function (err,appointments) {
				if(err) {
					console.log(err);
				}
				else {
					res.json(appointments);
				}
			})
		},
		create: function(req,res) {
			var appointment = new Appointment(
				{date: req.body.date,
			     time: req.body.time,
			     patient_name: req.body.patient_name,
			     complain: req.body.complain,
				});
			appointment.save(function (err) {
				if(err) {
					console.log(err); 
				}
				else {
					console.log("Successfully added an appointment!");
					res.json(appointment);
				}
			})
		},
		destroy: function(req,res) {
			Appointment.remove({_id: req.body.id}, function (err) {
				if(err) {
					console.log(err);
				}
				else {
					console.log("Successfully removed an appointment")
				}
			})
		}
	}
})();