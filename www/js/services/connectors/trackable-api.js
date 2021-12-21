angular.module("melissa.services")
.factory('trackableApi', 
    ['apiClient', 'connectionIndicator',
    (apiClient, connectionIndicator) => {
  return {
    getFenData: async (fen) => {
      connectionIndicator.startSending();
      try {
        const fenData = await apiClient.getFenData(fen);
        connectionIndicator.success();
        return fenData;
      } catch (err) {
        connectionIndicator.error();
        return Promise.reject(err);
      }
      
    },
    getBase: async () => {
      connectionIndicator.startSending();
      try {
        const result = await apiClient.getBase();
        connectionIndicator.success();
        return result;
      } catch (err) {
        connectionIndicator.error();
        return Promise.reject(err);
      }
    }
  };
}])