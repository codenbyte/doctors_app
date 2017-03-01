var mongoose = require('mongoose');

var AppointmentSchema = new mongoose.Schema({
	date: Date,
	time: String,
	patient_name: String,
	complain: String,
	created_at: { type: Date, default: Date.now }
})

mongoose.model('Appointment', AppointmentSchema);