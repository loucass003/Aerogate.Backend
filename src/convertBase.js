const ConvertBase = (num) => {
    return {
        from : (baseFrom) => {
            return {
                to : (baseTo) => {
                    return parseInt(num, baseFrom).toString(baseTo);
                }
            };
        }
    };
};

export default ConvertBase
