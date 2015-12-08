(function() {
    'use strict';

    angular
        .module('myApp')
        .factory('CommonService', CommonService);

    CommonService.$inject = ['$log'];

    /* @ngInject */
    function CommonService($log) {
        var service = {
            parseXml: _parseXml,
            buildQuery: _buildQuery,
            xmlToJson: xmlToJson
        };
        return service;

        ////////////////


        function _parseXml(xmlDoc, isArray) {

            var row = xmlDoc.getElementsByTagName("row");
            var result = [];
            for (var i = 0; i < row.length; i++) {
                var obj = {};
                var attrLength = row[i].childNodes.length;
                for (var j = 0; j < attrLength; j++) {
                    var attrName = row[i].childNodes[j].nodeName;
                    var attrValue = row[i].childNodes[j].textContent;

                    if (isNaN(attrValue)) {
                        obj[attrName] = attrValue;
                    } else {
                        obj[attrName] = parseInt(attrValue);
                    }

                }
                result.push(obj);
            }
            return result;
        }

        // Changes XML to JSON
        function xmlToJson(xml) {
            try {
                var obj = {};
                if (xml.children.length > 0) {
                    for (var i = 0; i < xml.children.length; i++) {
                        var item = xml.children.item(i);
                        var nodeName = item.nodeName;

                        if (typeof(obj[nodeName]) == "undefined") {
                            obj[nodeName] = xmlToJson(item);
                        } else {
                            if (typeof(obj[nodeName].push) == "undefined") {
                                var old = obj[nodeName];

                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName].push(xmlToJson(item));
                        }
                    }
                } else {
                    obj = xml.textContent;
                }
                return obj;
            } catch (e) {
                console.log(e.message);
            }
        }

        /**
         * Build key value pair query
         * @param  {object} searchCriteria
         * @return {string}
         */
        function _buildQuery(searchCriteria) {
            var query = "";
            for (var key in searchCriteria) {
                query += encodeURIComponent(key) + "=" + encodeURIComponent(searchCriteria[key]) + "&";
            }
            return query;
        }
    }
})();
