var LuigiAPI = (function() {
    function LuigiAPI (urlRoot) {
        this.urlRoot = urlRoot;
    }

    function flatten(response, rootId) {
        var flattened = [];
        // Dirty hack to make the requested task indexed as 0
        // TODO: push downstream to graph.js
        if (rootId) {
            var rootNode = response[rootId];
            rootNode.taskId=rootId;
            flattened.push(rootNode);
            delete response[rootId];
        }
        $.each(response, function(key, value) {
            value.taskId = key;
            flattened.push(value);
        });
        return flattened;
    }

    function jsonRPC(url, paramObject, callback) {
        return $.ajax(url, {
            data: {data: JSON.stringify(paramObject)},
            method: "GET",
            success: callback,
            dataType: "json"
        });
    }

    LuigiAPI.prototype.getDependencyGraph = function (taskId, callback) {
        jsonRPC(this.urlRoot + "/dep_graph", {task_id: taskId}, function(response) {
            callback(flatten(response.response, taskId));
        });
    };

    LuigiAPI.prototype.getFailedTaskList = function(callback) {
        jsonRPC(this.urlRoot + "/task_list", {status: "FAILED", upstream_status: ""}, function(response) {
            callback(flatten(response.response));
        });
    };

    LuigiAPI.prototype.getUpstreamFailedTaskList = function(callback) {
        jsonRPC(this.urlRoot + "/task_list", {status: "PENDING", upstream_status: "UPSTREAM_FAILED"}, function(response) {
            callback(flatten(response.response));
        });
    };

    return LuigiAPI;
})();