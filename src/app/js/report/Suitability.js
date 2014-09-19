define([
	"dojo/Deferred",
	"dojo/promise/all"
], function (Deferred, all) {

	return {

		getSuitabilityData: function () {
			var deferred = new Deferred();

			function complete(data) {
				deferred.resolve(true);
			}

			all([
				this.getSuitableAreas(),
				this.getLegalClassData(),
				this.getRoadData(),
				this.getConcessionData(),
				this.computeLegalHistogram()
			]).then(complete);

			return deferred.promise;
		},

		getSuitableAreas: function () {
			var deferred = new Deferred();

			deferred.resolve(true);
			return deferred.promise;
		},

		getLegalClassData: function () {
			var deferred = new Deferred();

			deferred.resolve(true);
			return deferred.promise;
		},

		getRoadData: function () {
			var deferred = new Deferred();

			deferred.resolve(true);
			return deferred.promise;
		},

		getConcessionData: function () {
			var deferred = new Deferred();

			deferred.resolve(true);
			return deferred.promise;
		},

		computeLegalHistogram: function () {
			var deferred = new Deferred();

			deferred.resolve(true);
			return deferred.promise;
		}

	};

});