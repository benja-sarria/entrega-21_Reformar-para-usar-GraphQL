const calculateRandomNumbers = (times = 100000000) => {
    const numbers = {};
    for (let i = 1; i < times; i += 1) {
        const randomNumber = Math.ceil(Math.random() * 1000);
        if (!numbers[randomNumber]) {
            numbers[randomNumber] = 1;
        } else {
            numbers[randomNumber] += 1;
        }
    }

    return numbers;
};

process.on("message", (data) => {
    const result = calculateRandomNumbers(data);
    process.send(result);
});
