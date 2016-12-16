new function(){
    this.getCerts = function(){
        var vm = this;
        return $q(function (resolve, reject) {
            cadesplugin.async_spawn(function*(arg) {
                "use strict";

                var _storeObj = yield cadesplugin.CreateObjectAsync("CAPICOM.store");
                try {
                    yield _storeObj.Open();
                } catch (e) {
                    reject("Ошибка открытия контейнера: " + (e.message || e));
                }

                var certs = yield _storeObj.Certificates;
                var cnt = yield certs.Count;
                var dataOut = [];

                if (cnt == 0) {
                    reject("Сертификаты не обнаружены");
                } else {
                    var data = [];
                    for (var i = 1; i <= cnt; i++) {
                        var cert = yield certs.Item(i);

                        vm.extractCertInfo(cert,function(certObj){
                            dataOut.push(certObj);
                            if(dataOut.length == cnt){
                                resolve(dataOut);
                            }
                        })
                    }
                }
            })
        })
    };

    this.extractCertInfo = function(cert, callback){
            cadesplugin.async_spawn(function*(arg) {
                "use strict";
                var extractData = function (data) {
                    var map = {};
                    var arr = data.split(", ");
                    for (var i = 0; i < arr.length; i++) {
                        var prop = arr[i].split("=");
                        map[prop[0]] = prop[1] || ""
                    }
                    return map;
                };
                var pk = yield cert.PrivateKey;

                callback({
                    base64: yield cert.Export(0),
                    subject: extractData(yield cert.SubjectName),
                    container: yield pk.ContainerName,
                    issuer: extractData(yield cert.IssuerName),
                    start: yield cert.ValidFromDate,
                    expire: yield cert.ValidToDate
                })
            })

    };

    this.decrypt = function(encryptedData){
        return $q(function (resolve, reject) {
            cadesplugin.async_spawn(function*(arg) {
                try{
                    var oEnvelop = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPEnvelopedData");
                    yield oEnvelop.propset_ContentEncoding(1); //CADESCOM_BASE64_TO_BINARY;
                    yield oEnvelop.Decrypt(encryptedData);
                    var dataOut = yield oEnvelop.Content;
                    resolve(dataOut)
                }catch(e){
                    console.log(e);
                    reject({message:"csp.decrypt_error", description: (e.message || e)} );
                }
            })
        })
    };
}