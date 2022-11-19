function bubbleObject(obj) {
    let bubblObj = {};

    const dataValObj = obj.dataValues || [];

    try {
        for (let key of Object.keys(dataValObj)) {
            if (
                !(typeof dataValObj[key] === "object") ||
                dataValObj[key] instanceof Date
            ) {
                bubblObj[key] = dataValObj[key];
            } else {
                bubblObj = {
                    ...bubblObj,
                    ...bubbleObject(dataValObj[key]),
                };
            }
        }
    } catch (error) {
        console.log(error);
    }

    return bubblObj;
}

module.exports = bubbleObject;
