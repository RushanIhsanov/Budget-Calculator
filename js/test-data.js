let generateTestData = (function () {
    let ExampleItem = function (type, descr, sum) {
        this.type = type;
        this.descr = descr;
        this.sum = sum;
    };

    let testData = [
        new ExampleItem('inc', 'Зарплата', 1245),
        new ExampleItem('inc', 'Фриланс', 820),
        new ExampleItem('inc', 'Партнерская программа', 110),
        new ExampleItem('inc', 'Продажа', 90),
        new ExampleItem('exp', 'Рента', 400),
        new ExampleItem('exp', 'Бензин', 60),
        new ExampleItem('exp', 'Продукты', 300),
        new ExampleItem('exp', 'Развлечения', 100),
    ];

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // функция обновления разметки

    function insertInUI() {
        let random = getRandomInt(testData.length);
        let randomItem = testData[random];

        //находим поля в разметке
        document.querySelector('#input__type').value = randomItem.type;
        document.querySelector('#input__description').value = randomItem.descr;
        document.querySelector('#input__value').value = randomItem.sum;
    }

    return {
        init: insertInUI,
    };
})();

generateTestData.init();
