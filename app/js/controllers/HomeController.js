'use strict';

angular.module('issueTrackingSystem.home', [])
    .controller('HomeController', [
        '$scope',
        '$location',
        'pageNumber',
        'authService',
        'notifyService',
        'dashboardService',
        'projectsService',
        function($scope, $location, pageNumber, authService, notifyService, dashboardService, projectsService) {
            $scope.issueParams = {
                pageSize: 6,
                pageNumber: pageNumber
            };
            $scope.projectParams = {
                pageSize: 6,
                pageNumber: pageNumber
            };

            $scope.login = function(user) {
                authService.loginUser(user)
                    .then(function success() {
                        notifyService.showInfo('Login successful');
                        dashboardService.getMyIssues($scope.issueParams.pageSize, $scope.issueParams.pageNumber)
                            .then(function(receivedIssues) {
                                $scope.myIssues = receivedIssues;
                                $location.path('/');
                        });
                    }, function error(err) {
                        notifyService.showError('Login failed', err);
                    });
            };

            $scope.register = function (userData) {
                authService.registerUser(userData,
                    function success(){
                        notifyService.showInfo('Registration successful');
                        $location.path('/');
                    },
                    function error(err) {
                        notifyService.showError('Registration failed', err);
                    })
            };

            if(authService.isLoggedIn()) {
                authService.getUserInfo()
                    .then(function(receivedUserInfo){
                        $scope.userInfo = receivedUserInfo;
                        projectsService.getAffiliatedProjects(receivedUserInfo.Id, $scope.projectParams.pageSize, $scope.projectParams.pageNumber)
                            .then(function(receivedAffiliatedProjects){
                                $scope.affiliatedProjects = receivedAffiliatedProjects;
                                $location.path('/');
                            });

                    });

                dashboardService.getMyIssues($scope.issueParams.pageSize, $scope.issueParams.pageNumber)
                    .then(function(receivedIssues) {
                        $scope.myIssues = receivedIssues;
                        $location.path('/');
                });

                $scope.reloadAffiliatedProjects = function() {
                    projectsService.getAffiliatedProjects($scope.userInfo.Id, $scope.projectParams.pageSize, $scope.projectParams.pageNumber)
                        .then(function(receivedAffiliatedProjects){
                            $scope.affiliatedProjects = receivedAffiliatedProjects;
                            $location.path('/');
                        });
                };

                $scope.reloadIssues = function() {
                    dashboardService.getMyIssues($scope.issueParams.pageSize, $scope.issueParams.pageNumber)
                        .then(function(receivedIssues){
                            $scope.myIssues = receivedIssues;
                    }, function(error) {
                        notifyService.showError('Cannot load issues', error);
                    })
                };
            }
        }
    ]);