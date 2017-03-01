var myAppModule = angular.module('myApp', ['ngRoute']);
myAppModule.config(function ($routeProvider) {
  $routeProvider
    .when('/',{
        templateUrl: 'views/appointment.html'
    })
    .when('/appointment/new',{
        templateUrl: 'views/newAppointment.html'
    })
    .when('/loggedout',{
        templateUrl: 'views/logOut.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});


myAppModule.factory('appointmentFactory', function ($http) {
	var appointments = [];
	var factory = {};
	var current_user;

	factory.getAppointments = function (callback) {
		$http.get('/appointments').then(function (output) {
			appointments = output.data;
			callback(appointments);
		})
	}

	factory.addAppointment = function(info, callback) {
    console.log(info, "INFO IN THE FACTORY <<<<<");
		$http.post('/appointments/new', info).then(function (output) {
			callback(output.data);
		});
	}

	factory.removeAppointment = function(appointment_id) {
		$http.post('/appointments/destroy', {id: appointment_id}).then();
	}

	factory.getCurrentUser = function() {
		return current_user;
	}

	factory.setCurrentUser = function(user) {
		current_user = user;
	}

	return factory;
})

myAppModule.controller('appointmentsController', function ($scope, $location, appointmentFactory) {

	$scope.appointments = [];
	$scope.current_user = appointmentFactory.getCurrentUser();

	if($scope.current_user == undefined) {
		$scope.current_user = prompt("Please enter your name?");

		appointmentFactory.setCurrentUser($scope.current_user);
	}


	appointmentFactory.getAppointments(function (data) {
		$scope.appointments = data;
	});

	$scope.addAppointment = function () {
		$scope.errorMessages = [];


		if($scope.newAppointment.date == undefined || $scope.newAppointment.time == undefined || $scope.newAppointment.complain == undefined || $scope.newAppointment.complain == '') {
			$scope.errorMessages.push("Cannot be blank!");
			return;
		}

		if($scope.newAppointment.complain.length < 10) {
			$scope.errorMessages.push("Complain  10 characters minimium!");
		}

		if($scope.newAppointment.date < new Date()) {
			$scope.errorMessages.push("Date cannot be in the past!");
		}


		if(8 > $scope.newAppointment.time.getHours() || $scope.newAppointment.time.getHours() > 16) {
			$scope.errorMessages.push("Appt time must be between 8am - 5pm!");
		}

		user_count = 0;
		appointment_count = 0;
		var plan = new Date($scope.newAppointment.date);
		for(var i = 0; i < $scope.appointments.length; i++) {
			var compare = new Date($scope.appointments[i].date)
			if(compare.getTime() == plan.getTime()) {
				if($scope.appointments[i].patient_name == $scope.current_user) {
					$scope.errorMessages.push("May only one appointment per day!");
					break;
				}
				appointment_count++;
			}
		}
		if(appointment_count >= 3) {
			$scope.errorMessages.push("That date is full!");
		}


		if($scope.errorMessages.length > 0) {
			return;
		}


		$scope.newAppointment.patient_name = $scope.current_user;
		appointmentFactory.addAppointment($scope.newAppointment, function (output) {
      console.log(output, "output in controller");
			$location.path('#!/');
		});
		$scope.newAppointment = {};

	}

	$scope.removeAppointment = function (appointment) {
		$scope.errorInRemove = "";
		var now = Date.now();
		var compare = new Date(appointment.date);

		if(compare.getTime() - now < 86400000) {
			$scope.errorInRemove = "If needed, please cancel 24 hours before the appointment!";
			return;
		}
		appointmentFactory.removeAppointment(appointment._id);
		appointmentFactory.getAppointments(function (data) {
			$scope.appointments = data;
		});
	}

	$scope.isPast = function (appointment) {
		var now = Date.now();
		var compare = new Date(appointment.date);
		return !(now > compare.getTime());
	}

	$scope.logout = function() {
		appointmentFactory.setCurrentUser(null);
    $location.path('#!/loggedout');
	}
})
