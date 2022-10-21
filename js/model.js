let modelController = (function () {
    let Income = function (id, descr, value) {
        this.id = id;
        this.descr = descr;
        this.value = value;
    };

    let Expense = function (id, descr, value) {
        this.id = id;
        this.descr = descr;
        this.value = value;
        this.percentage = -1;
    };

    // Метод для расчета процентов
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    // Метод для того чтобы вернуть данные по процентам
    Expense.prototype.getPercantage = function () {
        return this.percentage;
    };

    function addItem(type, descr, value) {
        let newItem, id;
        id = 0;

        //Генерируем id
        if (data.allItems[type].length > 0) {
            let lastIndex = data.allItems[type].length - 1;
            id = data.allItems[type][lastIndex].id + 1;
        } else {
            id = 0;
        }
        // В зависимости от типа используем соотв-й конструктор и создаем объект
        if (type === 'inc') {
            newItem = new Income(id, descr, parseFloat(value));
        } else if (type === 'exp') {
            newItem = new Expense(id, descr, parseFloat(value));
        }

        // Записываем запись(объект) в нашу структуру данных
        data.allItems[type].push(newItem);

        // Возвращаем новый объект

        return newItem;
    }

    function deleteItem(type, id) {
        // К нам пришли данные inc, id = 4;
        // data.allItems[type][item][id]
        // Записи по inc
        // id = [0,2,3,10]
        // Находим индекс элемента index =2;
        // 1. Находим запись по ID в массиве с доходами и расходами.

        let ids = data.allItems[type].map(function (item) {
            return item.id;
        });

        // console.log(ids);

        // определяем индекс
        index = ids.indexOf(id);
        // console.log(index);
        // 2. Удаляем запись из массива по индексу
        if (index !== -1) {
            data.allItems[type].splice(index, 1);
        }

        console.log(data.allItems);
    }

    function calculateTotalSum(type) {
        let sum = 0;

        data.allItems[type].forEach(function (item) {
            sum += item.value;
        });

        return sum;
    }

    function calculateBudget() {
        // Посчитать доходы
        data.totals.inc = calculateTotalSum('inc');
        data.totals.exp = calculateTotalSum('exp');
        // Посчитаем общий бюджет
        data.budget = data.totals.inc - data.totals.exp;

        // Посчитаем % для расходов
        if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
    }

    // Функция которая возвращает бюджет
    function getBudget() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage,
        };
    }

    function calculatePercentages() {
        data.allItems.exp.forEach(function (item) {
            item.calcPercentage(data.totals.inc);
        });
    }

    function getAllIdAndPercentages() {
        // Получаем двухмерный массив с данными id и процентами
        // [ [0,15], [1,23], [2,38] ]
        let allPerc = data.allItems.exp.map(function (item) {
            return [item.id, item.getPercantage()];
        });

        return allPerc;
    }

    let data = {
        allItems: {
            inc: [],
            exp: [],
        },

        totals: {
            inc: 0,
            exp: 0,
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: addItem,
        calculateBudget: calculateBudget,
        getBudget: getBudget,
        deleteItem: deleteItem,
        calculatePercentages: calculatePercentages,
        getAllIdAndPercentages: getAllIdAndPercentages,
        test: function () {
            console.log(data);
        },
    };
})();
