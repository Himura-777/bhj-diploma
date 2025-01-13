/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
	/**
	 * Устанавливает полученный элемент
	 * в свойство element.
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error("Ошибка");
		}

		this.element = element;
		this.registerEvents();
	}
	/**
	 * Регистрирует обработчики нажатия на
	 * кнопки «Новый доход» и «Новый расход».
	 * При нажатии вызывает Modal.open() для
	 * экземпляра окна
	 * */
	registerEvents() {
		const incomeButton = this.element.querySelector(".create-income-button");
		const expenseButton = this.element.querySelector(".create-expense-button");

		incomeButton.addEventListener("click", () => {
			App.getModal("newIncome").open();
		});

		expenseButton.addEventListener("click", () => {
			const expenseModal = App.getModal("newExpense").open();
		});
	}
}
