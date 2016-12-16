(function() {
    'use strict';

    angular.module('uzedoApp')
        .factory('OperatorAuth', OperatorAuth);

    OperatorAuth.$inject = ['$q','$http', '$httpParamSerializerJQLike', 'Operator', 'SettingsService', 'CSPService', 'API_PATH'];

    function OperatorAuth($q, $http, $httpParamSerializerJQLike, Operator, SettingsService, CSPService, API_PATH) {
        var tokens = [];
        var service = {
            tokens: tokens,
            authenticate: authenticate

        };

        return service;

        function authenticate(params){
            var defer = $q.defer();

            var _params = angular.extend({}, params);
            var _operatorCode = _params.operator || SettingsService.getOperator();
            _params.operator = _operatorCode;

            if(_params.force || !this.tokens[_operatorCode]) {
                getOperatorInfo(_operatorCode).then(function(operatorInfo){
                    if(operatorInfo.authType.indexOf("Certificate")>-1){
                        var needDecrypt = (operatorInfo.authTypeDecrypt.indexOf("Certificate")>-1);
                        authenticateByCert(_params).then(function(token){
                            if(!needDecrypt){
                                tokens[_operatorCode] = token;
                                defer.resolve(token)
                            }else{
                                CSPService.decrypt(token).then(function(token){
                                    tokens[_operatorCode] = token;
                                    defer.resolve(token)
                                }).catch(function(error){
                                    defer.reject(error)
                                })
                            }
                        })
                    }
                });
            }else{
                defer.resolve(this.tokens[_operatorCode]);
            }
            return defer.promise;
        }

        function authenticateByCert(params) {
            var defer = $q.defer();
            CSPService.getKeys(params).then(function(keys){
                var data = {
                    operator: params.operator,
                    cert: keys.base64
                };
                $http({
                    url: API_PATH+"operator/authenticate/cert",
                    method: 'POST',
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformResponse: []

                }).then(function(response){
                    defer.resolve(response.data)
                });

            });
            return defer.promise;
        }

        function authenticateByLogin(params){

        }

        function getOperatorInfo(operatorCode){
            var defer = $q.defer();
            var _operator  = operatorCode;
            Operator.query(function (operators) {

                for(var i=0; i<operators.length; i++){
                    if(operators[i].code === _operator){
                        defer.resolve(operators[i]);
                        break;
                    }
                }
                defer.reject()

            });

            return defer.promise;
        }
    }
})();
