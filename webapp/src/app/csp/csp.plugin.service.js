(function() {
    'use strict';

    angular.module('uzedoApp')
        .provider('CSPPlugin', CSPPlugin);

    function CSPPlugin() {
        var vm = this;

        var canPromise = !!window.Promise;
        var plugin_resolved = 0;
        var cadesplugin = null; //спец объект, вызываемых из хромного расширения

        if(canPromise){
            cadesplugin = new Promise(function(resolve, reject){
                window.plugin_resolve = resolve;
                window.plugin_reject = reject;
            });
        } else{
            cadesplugin = {};
        }

        window.cadesplugin = cadesplugin;

        this.$get =  function() {

            return {
                pluginObject: null,
                canPromise: canPromise,
                useAsync: false,

                async_spawn: function (generatorFunc) {
                    function continuer(verb, arg) {
                        var result;
                        try {
                            result = generator[verb](arg);
                        } catch (err) {
                            return Promise.reject(err);
                        }
                        if (result.done) {
                            return result.value;
                        } else {
                            return Promise.resolve(result.value).then(onFulfilled, onRejected);
                        }
                    }
                    var generator = generatorFunc(Array.prototype.slice.call(arguments, 1));
                    var onFulfilled = continuer.bind(continuer, "next");
                    var onRejected = continuer.bind(continuer, "throw");
                    return onFulfilled();
                },

                checkForPlugin: function(callbackFunc){
                    var vm = this;
                    if(this.isChromiumBased()){
                        if(plugin_resolved == 1){   //уже готов
                            if(!this.pluginObject){
                                throw "Плагин не загружен!"
                            }
                            if(callbackFunc){
                                callbackFunc()
                            }
                        }else{
                            this.useAsync = true;

                            cadesplugin.set = function(pluginObj){   //дернется хромовым расширением
                                vm.pluginObject = pluginObj;
                            };

                            cadesplugin.async_spawn = this.async_spawn;

                            cadesplugin.CreateObjectAsync = function(name){
                                return vm.pluginObject.CreateObjectAsync(name);
                            };

                            this.load_chrome_extension();

                            window.postMessage("cadesplugin_echo_request", "*");
                            window.addEventListener("message", function (event){
                                    if (event.data != "cadesplugin_loaded") return;
                                    var cb = callbackFunc;
                                    var f1 = function(){
                                        vm.plugin_loaded();
                                        if(cb) cb();
                                    };

                                    setTimeout(function(){
                                        cpcsp_chrome_nmcades.check_chrome_plugin(f1, function(){alert("Ошибка загрузки плагина")});
                                    },100)

                                },
                                false);
                            setTimeout(vm.check_load_timeout, 20000);
                        }
                    }else{
                        this.checkNpapiPlugin();
                        if(callbackFunc) callbackFunc();
                    }

                },


                createObject: function(name){
                    if (this.isIE()) {
                        return new ActiveXObject(name);
                    }else{
                        var cadesobject = document.getElementById('cadesplugin');
                        if (!cadesobject) {
                            var appTag = document.createElement("object");
                            appTag.id = "cadesplugin";
                            appTag.type="application/x-cades";
                            appTag.class="hiddenObject";
                            document.body.appendChild(appTag);
                            cadesobject = document.getElementById('cadesplugin');
                        }

                        try {
                            return cadesobject.CreateObject(name);
                        } catch (err) {
                            throw({number: 10000, message: "Не удалось создать объект "+name+": " + (err.message || err)});
                        }
                    }

                },

                checkNpapiPlugin: function(){

                    try {
                        var oAbout = this.createObject("CAdESCOM.About");
                        if(window.console) console.log("Плагин загружен. Версия " + ( oAbout.PluginVersion || oAbout.Version ));
                        this.plugin_loaded();

                    }catch (err) {
                        var isPluginLoaded = false;
                        var isPluginEnabled = false;

                        if(window.console) console.log(err);
                        // Объект создать не удалось, проверим, установлен ли
                        // вообще плагин. Такая возможность есть не во всех браузерах
                        var mimetype = navigator.mimeTypes["application/x-cades"];
                        if (mimetype) {
                            isPluginLoaded = true;
                            var plugin = mimetype.enabledPlugin;
                            if (plugin) {
                                isPluginEnabled = true;
                            }
                        }
                        if(isPluginLoaded){
                            throw("Браузерный плагин КриптоПро найден, но не активирован")
                        }else{
                            throw("Браузерный плагин КриптоПро не установлен")
                        }
                    }

                },

                plugin_loaded: function(){
                    plugin_resolved = 1;
                    if(canPromise){
                        plugin_resolve();
                    }else{
                        window.postMessage("cadesplugin_loaded", "*");
                    }
                },

                plugin_loaded_error: function(msg){
                    plugin_resolved = 1;
                    if(this.canPromise){
                        plugin_reject(msg);
                        throw "Ошибка загрузки плагина"
                    } else {
                        window.postMessage("cadesplugin_load_error", "*");
                    }
                },

                load_chrome_extension: function(){
                    var fileref = document.createElement('script');
                    fileref.setAttribute("type", "text/javascript");
                    fileref.setAttribute("src", "chrome-extension://iifchhfnnmpdbibifmljnfjhpififfog/nmcades_plugin_api.js");
                    document.getElementsByTagName("head")[0].appendChild(fileref);
                },

                check_load_timeout: function() {
                    if (plugin_resolved == 1)
                        return;

                    plugin_resolved = 1;
                    if (this.canPromise) {
                        alert("Истекло время ожидания загрузки плагина");
                        plugin_reject("Истекло время ожидания загрузки плагина");
                    } else {
                        window.postMessage("cadesplugin_load_error", "*");
                    }

                },

                isChromiumBased: function(){
                    var retVal_chrome = navigator.userAgent.match(/chrome/i);
                    var retVal_opera = navigator.userAgent.match(/opr/i);

                    if(retVal_chrome==null) // В Firefox работаем через NPAPI
                        return false;
                    else
                    {
                        if((retVal_chrome.length>0) && (retVal_opera==null)) // В Chrome работаем через асинхронную версию
                        {
                            return true;
                        }

                        if((retVal_opera!=null) && (retVal_opera.length>0)) // В Opera работаем через NPAPI
                        {
                            return false;
                        }
                    }
                },

                isIE: function(){
                    var retVal = (("Microsoft Internet Explorer" == navigator.appName) || // IE < 11
                    navigator.userAgent.match(/Trident\/./i)); // IE 11
                    return retVal;
                },

                isIOS: function() {
                    var retVal = (navigator.userAgent.match(/ipod/i) ||
                    navigator.userAgent.match(/ipad/i) ||
                    navigator.userAgent.match(/iphone/i));
                    return retVal;
                }
            };


        }
    }
})();
