(function () {
    'use strict';

    angular.module('uzedoApp')
        .controller('DocController', DocController);

    DocController.$inject = ['$scope', '$state', 'Doc', 'FileUploader', 'API_PATH', 'entity', 'Content', 'AlertService'];

    function DocController($scope, $state, Doc, FileUploader, API_PATH, entity, Content, AlertService) {
        var vm = this;
        vm.doc = entity || {};
        vm.selectedDoc = undefined;
        vm.isUploaded = false;
        vm.fileToken = undefined;
        vm.documentTypes = undefined;
        vm.docContent = undefined;

        vm.save = save;
        //vm.cancel = cancel;
        //vm.upload = upload;
        vm.showContent = showContent;

        var uploader = $scope.uploader = new FileUploader({
            url: API_PATH + 'content/uploadFile'
        });

        getDocumentTypes();

        function showContent() {
            window.open(API_PATH + 'content/getContent/' + vm.doc.content.id, "_blank");
        }

        function getDocumentTypes() {
            Doc.documentTypes(function(types){
                vm.documentTypes = undefined;
                if(types) {
                    vm.documentTypes = [];
                    types.forEach(function(item, i, arr){
                        vm.documentTypes.push(item);
                    });
                }
            });
        }

        // FILTERS

        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                //console.log('syncFilter');
                return this.queue.length < 1;
            }
        });

        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                //console.log('asyncFilter');
                deferred.resolve();
                //return true;
            }
        });

        uploader.getIsEverythingUploaded = function () {
            var result = true;
            uploader.queue.forEach(function (item, i, arr) {
                //console.log(item);
                result = result && item.isSuccess;
            });

            return result;
        };


        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            //console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            //console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            //console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.doc.fileName = fileItem.file.name;
            vm.doc.content = {
                fileName: fileItem.file.name,
                size: fileItem.file.size
            };
            vm.fileToken = response;
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            //console.info('onCompleteAll');
        };

        function save() {
            Doc.save({document: vm.doc, contentTokens: [vm.fileToken]}, function (resp) {
                if (resp) {
                    vm.doc = resp;
                    vm.file = undefined;
                    AlertService.success("documentController.save.success")
                }
            });
        }


    }
})();
