let controller = (function (budgetCtrl, uiCtrl) {
    let setupEventListeners = function () {
        let DOM = uiCtrl.getDomStrings();
        document.querySelector(DOM.form).addEventListener('submit', ctrlAddItem);

        // Клик по таблице с доходами и расходами
        document.querySelector(DOM.budgetTtable).addEventListener('click', ctrlDeleteItem);
    };

    // Обновляем проценты по каждой записи
    function updatePercantages() {
        // 1. Посчитаем проценты для каждой записи типа Expense
        budgetCtrl.calculatePercentages();
        // 2. Получаем данные по процентам с модели
        let idsAndPercents = budgetCtrl.getAllIdAndPercentages();
        console.log(idsAndPercents);
        // 3. Обновить UI с новыми процентами
        uiCtrl.updateItemsPercentages(idsAndPercents);
    }

    // Функция которая срабатывает при отправке формы
    function ctrlAddItem(event) {
        event.preventDefault();

        // 1. Получить данные из формы
        let input = uiCtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Добавить полученные данные в модель
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            budgetCtrl.test();
            // 3. Добавить запись в UI
            uiCtrl.renderListItem(newItem, input.type);
            uiCtrl.clearFields();
            generateTestData.init();

            // 4. Посчитать бюджет
            updateBudget();

            // 5. Пересчиталт проценты
            updatePercantages();
        } // end if
    }

    function ctrlDeleteItem(event) {
        let itemID, splitID, type;

        // console.log('fired');
        if (event.target.closest('.item__remove')) {
            // Находим id записи которую надо удалить
            itemID = event.target.closest('li.budget-list__item').id; // inc-0

            // Разбиваем itemID на 2 части
            splitID = itemID.split('-'); // 'inc-0' => ['inc', 0];
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Удалить запись из модели
            budgetCtrl.deleteItem(type, ID);

            // Удалить запись из шаблона
            uiCtrl.deleteListItem(itemID);

            // пересчитываем бюджет
            updateBudget();

            updatePercantages();
        }
    }

    function updateBudget() {
        // 1. Рассчитать бюджет модели
        budgetCtrl.calculateBudget();
        // 2. Получить рассчитанный бюджет из модели
        budgetObj = budgetCtrl.getBudget();
        // 3. Отобразить бюджет в модели
        uiCtrl.updateBudget(budgetObj);
    }

    return {
        init: function () {
            console.log('App started');
            uiCtrl.displayMonth();
            setupEventListeners();
            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
        },
    };
})(modelController, viewController);

controller.init();
