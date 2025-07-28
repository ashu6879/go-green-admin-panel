export function convertTimeRange(start, end) {
    function formatTime(time) {
      const [hour, minute] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hour));
      date.setMinutes(parseInt(minute));
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  
    return `${formatTime(start)} - ${formatTime(end)}`;
  }


  export const formatPrice = (value, symbol = '$') => {
    const num = Number(value);
  
    if (isNaN(num)) return "-";
  
    const formatted = num.toLocaleString();
  
    if (symbol === false) {
      return formatted;
    }
  
    return `${symbol}${formatted}`;
  };
  



export function normalizeAttributes(allAttributesJson) {
    try {
      console.log("=============================================================");
      
      console.log("allAttributesJson",allAttributesJson)
      // Step 1: Parse JSON
      // const rawArr = JSON.parse(allAttributesJson);
  
      // Step 2: Normalize keys to { key, value }
      const normalized = allAttributesJson.map(item => ({
        key: item.attribute_key ?? item.key,
        value: item.attribute_value ?? item.value
      }));
      console.log("normalized=========",normalized)
  
      // Step 3: Separate extra attributes
      const extras = ['unit', 'quantity', 'is_available'];
  
      const attributes = normalized.filter(item => !extras.includes(item.key));
      const extraAttributesArray = normalized.filter(item => extras.includes(item.key));
      const extraAttributes = Object.fromEntries(
        extraAttributesArray.map(item => [item.key, item.value])
      );  
      console.log("attributes=========",attributes)
      console.log("extraAttributes========",extraAttributes)
      console.log("=============================================================");

      return {
        attributes,
        extraAttributes
      };
    } catch (error) {
      console.error('Failed to parse attributes:', error);
      return {
        attributes: [],
        extraAttributes: []
      };
    }
  }
  