const validateJson = (body) => {

    // Validate the required fields in the JSON
    const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return false;
      }
    }
    return true;
  };
  
  module.exports = validateJson;
  