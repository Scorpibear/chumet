'use strict';

angular.module("melissa.services")
    .value("base", base)
    .value("queueToAnalyze", [])
    .constant("sendForAnalysisTimeout", 3000)
    .factory("baseProvider", [
            '$http', 'base', 'positionSelector', 'moveValidator', 'queueToAnalyze', 'sendForAnalysisTimeout',
            function ($http, base, positionSelector, moveValidator, queueToAnalyze, sendForAnalysisTimeout) {
        var baseUpdated = false;
        base.fen = '';
        var backendUrl = 'http://localhost:9966';
        $http({method: 'GET', url: backendUrl + '/api/getbase', transformResponse: false}).
            success(function (data) {
                console.log("new base received, ", data.length, " bytes");
                base = (new Function("var base = " + data + "; return base;"))();
                base.fen = '';
                baseUpdated = true;
            }).
            error(function(data, status, headers, config) {
                console.error("could not update base from server: ", data, status, headers, config);
            });
        var sendForAnalysisInProgress = false;
        var sendForAnalysis = function() {
            if(queueToAnalyze.length > 0) {
                sendForAnalysisInProgress = true;
                var dataToAnalyze = queueToAnalyze[0];
                $http.post(backendUrl + '/api/analyze', {moves: dataToAnalyze}).
                    success(function () {
                        queueToAnalyze.shift();
                        sendForAnalysisInProgress = false;
                        console.log('post success');
                    }).
                    error(function () {
                        sendForAnalysisInProgress = false;
                        console.log('post error');
                    })
            }
        };
        setInterval(sendForAnalysis, sendForAnalysisTimeout);

        return {
            getStart: function () {
                return base;
            },
            getBestSubPositions: function (positionObject) {
                if (baseUpdated) {
                    positionObject = base;
                    baseUpdated = false;
                }
                return positionSelector.getBestSubPositions(positionObject);
            },
            validateMoves: function(moves) {
                var result = moveValidator.validate(moves, base);
                if (result == "unknown") {
                    var movesWithoutLast = moves.slice(0,moves.length-1);
                    queueToAnalyze.push(movesWithoutLast);
                }
                return result;
            }
        }
    }]);