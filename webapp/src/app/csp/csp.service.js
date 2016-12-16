(function() {
    'use strict';

    angular.module('uzedoApp')
        .provider('CSPService', CSPService);

    function CSPService() {
        var vm = this;
        this._keys = null;

        this.$get = getService;

        getService.$inject = ['$q','$uibModal', 'CSPPlugin', '$injector'];

        function getService ($q, $uibModal, CSPPlugin, $injector) {
            var keys = vm._keys;

            return {
                pluginChecked: false,
                certs: null,

                /**
                 * Получение данных сертификата пользователя
                 * @param params объект параметров. force
                 * @returns {промис, в который вернутся данные}
                 */
                getKeys: function (params) {
                    var vm = this;

                    return $q(function (resolve, reject) {
                        var params_ = angular.extend({}, params, {force: false});

                        //вызов выбиралки сертификатов
                        var _selectCerts = function(certs){
                            vm.selectCertificate(certs).then(function(cert){
                                    resolve(cert)
                                },
                                function(e){
                                    reject(e.message || e)
                                }
                            )
                        };

                        //вызов считывания сертификатов
                        var _initCerts = function(){
                            if(vm.pluginChecked && vm.certs) {
                                _selectCerts(vm.certs)
                            }else{
                                vm.getCerts().then(function (certs) {
                                        vm.certs = certs;
                                        _selectCerts(certs)
                                    },
                                    function (e) {
                                        reject(e)
                                    }
                                );
                            }
                        };

                        if (keys && !params_.force) {
                            resolve(keys);
                        } else {
                            CSPPlugin.checkForPlugin(function () {
                                if(vm.pluginChecked){
                                    _initCerts()
                                }else{
                                    try {
                                        if(CSPPlugin.useAsync) {
                                            console.log("async!");
                                            //подгрузка кода для асинхронной работы с плагином CSP в Хроме
                                            $.ajax({
                                                url: "app/csp/csp.service.async.js",
                                                dataType: "text",
                                                cache: true,
                                                success: function(script){
                                                    vm.pluginChecked = true;
                                                    var asyncService = eval("("+script+")");

                                                    //переопределяем некоторые методы данного сервиса
                                                    angular.extend(vm, asyncService);
                                                    _initCerts()
                                                }
                                            });

                                        } else {
                                            console.log("sync!");
                                            vm.pluginChecked = true;
                                            _initCerts();
                                        }


                                    } catch (e) {
                                        console.log(e);
                                        reject(e.message || e)
                                    }
                                }

                            });

                        }
                    });
                },

                getCerts: function () {
                    var vm = this;
                    return $q(function (resolve, reject) {
                        var _storeObj = CSPPlugin.createObject("CAPICOM.store");
                        try {
                            _storeObj.Open();
                        } catch (e) {
                            reject("Ошибка открытия контейнера: " + (e.message || e));
                        }

                        var certs = _storeObj.Certificates;
                        var cnt = _storeObj.Certificates.Count;
                        var dataOut = [];

                        if (cnt == 0) {
                            reject("Сертификаты не обнаружены");
                        } else {
                            var data = [];
                            for (var i = 1; i <= cnt; i++) {
                                dataOut.push(vm.extractCertInfo(certs.Item(i)));
                            }
                        }

                        resolve(dataOut)
                    });
                },

                decrypt: function(encryptedData){
                    return $q(function (resolve, reject) {
                        try{
                            var oEnvelop = CSPPlugin.createObject("CAdESCOM.CPEnvelopedData");
                            oEnvelop.ContentEncoding = 1; //CADESCOM_BASE64_TO_BINARY;
                            oEnvelop.Decrypt(encryptedData);
                            var dataOut = oEnvelop.Content;
                            resolve(dataOut);
                        }catch(e){
                            if(window.console) console.log(e);
                            reject({message:"csp.decrypt_error", description: (e.message || e)} );
                        }
                    })
                },

                selectCertificate: function (certs){
                    return $uibModal.open({
                        animation: false,
                        templateUrl: 'app/csp/cert-dialog.html',
                        controller: 'CertDialogController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            certs: function() {
                                return certs;
                            }
                        }
                    }).result;
                },


                extractCertInfo: function(cert){
                    var extractData = function(data) {
                        var map = {};
                        var arr = data.split(", ");
                        for (var i = 0; i < arr.length; i++) {
                            var prop = arr[i].split("=");
                            map[prop[0]] = prop[1] || ""
                        }
                        return map;
                    }
                    return {
                        base64: cert.Export(0),
                        subject: extractData(cert.SubjectName),
                        container: cert.PrivateKey.ContainerName,
                        issuer: extractData(cert.IssuerName),
                        start: cert.ValidFromDate,
                        expire: cert.ValidToDate
                    }


                }


            }
        }
    }
})();
