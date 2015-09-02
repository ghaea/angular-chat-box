var app = angular.module("chatApp", [])
	.controller("messageController", function($scope, $http, $interval){
		var userList
		// Gets user list
		$http.get("https://tiy-chat-server.herokuapp.com/user")
			.success(function(data) {
				userList = data
			})

		// Get recent messages
		var getMsgs = function() {
			$http.get("https://tiy-chat-server.herokuapp.com/messages/recent")
			.success(function(data) {
				$scope.messages = data
				// Convert message.user_id to user.username
				_.each(data, function(msg) {
					//console.log(msg.timestamp)
					msg.timestamp = moment(msg.timestamp).format('h:mm a')

					var msgId = msg.user_id

					_.each(userList, function(user) {
						var userId = user._id
						var userName = user.userName

						if(msgId === userId) {
							return msg.user_id = user.username
						}
					})
				})
			})
		}
		$interval(getMsgs, 1000)
	})

	.controller("userController", function($scope, $http, $interval){
		// Button creates new user
		$scope.createButton = function() {
			$scope.user = {
			fullname: $scope.fullName,
			username: $scope.userName, 
			status: $scope.status
			}
			// Posts user
			$http.post("https://tiy-chat-server.herokuapp.com/user", $scope.user)
				.success(function() {
					console.log('new user created')
					getUser()
					$scope.userName = ""
					$scope.fullName = ""
				})
		}
		// Gets user list
		var getUser = function() { $http.get("https://tiy-chat-server.herokuapp.com/user")
			.success(function(data) {
				$scope.users = data
			})
		}
		$interval(getUser, 1000)
	})

	.controller("inputController", function($scope, $http, $interval){
		// Gets user list
		$http.get("https://tiy-chat-server.herokuapp.com/user")
			.success(function(data) {
				$scope.users = data
			})

		// Button submits message in textbox
		$scope.submitButton = function() {
			$scope.messageText = {
				text: $scope.message,
				user_id: $scope.user_id
			} 

			$http.post("https://tiy-chat-server.herokuapp.com/message", $scope.messageText)
				.success(function(data) {
					$scope.message = ""
				})
		}

	})

