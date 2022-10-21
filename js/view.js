let viewController = (function () {
    let DOMstrings = {
        inputType: '#input__type',
        inputDescription: '#input__description',
        inputValue: '#input__value',
        form: '#budget-form',
        incomeContainer: '#income__list',
        expenseContainer: '#expenses__list',
        budgetLabel: '#budget-value',
        incomeLabel: '#income-label',
        expenseLabel: '#expence-label',
        expensePercentLabel: '#expence-percent-label',
        budgetTtable: '#budget-table',
        monthLabel: '#month',
        yearLabel: '#year',
    };

    function getInput() {
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value,
        };
    }

    function formatNumber(num, type) {
        let numSplit, int, dec, newInt, resultNumber;

        /*
        + или - перед числом в зависимости от типа
        добавить 2 знака после точки, десятые и сотые
        58 => 58.00
        87.235325 => 87.23
        */
        // Убираем знак минус у числа
        num = Math.abs(num);
        // приводим число к 2 цифрам после запятой
        num = num.toFixed(2);

        // Делим число на целые и сотые
        numSplit = num.split('.'); // 48.78 => [45, 78]
        // Целая часть
        int = numSplit[0];
        // Десятая часть
        dec = numSplit[1];

        // Расставляем запятые
        // Исходя из длины числа делим его на части по 3 цифры
        // Начиная с правой стороны проставляем запятые после каждого третьего числа
        // 123456789 => 123,456,789
        // если длина номера больше 3 цифры значит надо ставить запятые
        if (int.length > 3) {
            newInt = '';

            // 123456789
            console.log(int.length);

            for (let i = 0; i < int.length / 3; i++) {
                console.log(i);
                // ФОрмирую новую строку с номером
                newInt =
                    // Добавляю запятую каждые 3 числа
                    ',' +
                    // Вырезаю кусок из исходной строки
                    int.substring(int.length - 3 * (i + 1), int.length - 3 * i) +
                    // Конец строки, правая часть
                    newInt;
                console.log(newInt);
            }
            console.log(newInt);

            if (newInt[0] == ',') {
                newInt = newInt.substring(1);
            }

            // если исходное число равно 0, то в новую строку записываем 0
        } else if (int === '0') {
            newInt = '0';
            // если исходное число имеет 3 и менее символов
        } else {
            newInt = int;
        }

        resultNumber = newInt + '.' + dec;

        if (type === 'exp') {
            resultNumber = '- ' + resultNumber;
        } else if (type === 'inc') {
            resultNumber = '+ ' + resultNumber;
        }

        return resultNumber;
        //
    }

    function renderListItem(obj, type) {
        let containerElement, html;
        if (type === 'inc') {
            containerElement = DOMstrings.incomeContainer;
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">%value%</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>`;
        } else {
            containerElement = DOMstrings.expenseContainer;
            html = `<li id="exp-%id%" class="budget-list__item item item--expense">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">
                                %value%
                                <div class="item__badge">
                                    <div class="item__percent badge badge--dark">
                                        15%
                                    </div>
                                </div>
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`;
        }

        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.descr);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        document.querySelector(containerElement).insertAdjacentHTML('beforeend', newHtml);
    }

    function clearFields() {
        let inputDesc, inputVal;
        inputDesc = document.querySelector(DOMstrings.inputDescription);
        inputDesc.focus();
        inputVal = document.querySelector(DOMstrings.inputValue);

        inputDesc.value = '';
        inputVal.value = '';
    }

    function updateBudget(obj) {
        let type;
        if (obj.budget > 0) {
            type = 'inc';
        } else {
            type = 'exp';
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.expensePercentLabel).textContent = obj.percentage;
        } else {
            document.querySelector(DOMstrings.expensePercentLabel).textContent = '--';
        }
    }

    function deleteListItem(itemID) {
        document.getElementById(itemID).remove();
    }

    function updateItemsPercentages(items) {
        items.forEach(function (item) {
            // [ 0,26 ] примерный item;
            // Находим блок с процентами
            let el = document.getElementById(`exp-${item[0]}`).querySelector('.item__percent');
            // el.textContent = item[1] + '%';

            // Делаем проверку если значения % = "-1" когда нет доходов
            if (item[1] >= 0) {
                // Если есть то показываем блок с %
                el.parentElement.style.display = 'block';
                // Меняем контент внутри бейджика с процентами
                el.textContent = item[1] + '%';
            } else {
                // Если нет - то скрываем бейдж с процентами
                el.parentElement.style.display = 'none';
            }
        });
    }

    function displayMonth() {
        let now, year, month;
        now = new Date();
        year = now.getFullYear(); // 2020
        month = now.getMonth(); // Январь - 0... апрель - 3

        monthArr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        month = monthArr[month];

        document.querySelector(DOMstrings.monthLabel).innerText = month;
        document.querySelector(DOMstrings.yearLabel).innerText = year;
    }

    return {
        getInput: getInput,
        renderListItem: renderListItem,
        clearFields: clearFields,
        updateBudget: updateBudget,
        deleteListItem: deleteListItem,
        updateItemsPercentages: updateItemsPercentages,
        displayMonth: displayMonth,
        getDomStrings: function () {
            return DOMstrings;
        },
    };
})();
