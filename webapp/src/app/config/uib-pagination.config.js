(function() {
    'use strict';

    angular.module('uzedoApp')
        .config(paginationConfig);

    paginationConfig.$inject = ['uibPaginationConfig'];

    function paginationConfig(uibPaginationConfig) {
        uibPaginationConfig.itemsPerPage = 20;
        uibPaginationConfig.maxSize = 5;
        uibPaginationConfig.boundaryLinks = true;
        uibPaginationConfig.firstText = '«';
        uibPaginationConfig.previousText = '‹';
        uibPaginationConfig.nextText = '›';
        uibPaginationConfig.lastText = '»';
    }
})();
