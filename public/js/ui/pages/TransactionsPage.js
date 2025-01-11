/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) {
			throw new Error("Ошибка");
		}

		this.element = element;
		this.lastOptions = null;
		this.registerEvents();
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		if (this.lastOptions) {
			this.render(this.lastOptions);
		}
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		this.element.addEventListener("click", event => {
			if (event.target.closest(".remove-account")) {
				this.removeAccount();
			}

			const transactionRemoveButton = event.target.closest(
				".transaction__remove"
			);
			if (transactionRemoveButton) {
				const transactionId = transactionRemoveButton.dataset.id;
				this.removeTransaction(transactionId);
			}
		});
	}

	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
	 * либо обновляйте только виджет со счетами и формы создания дохода и расхода
	 * для обновления приложения
	 * */
	removeAccount() {
		if (!this.lastOptions) return;

		if (confirm("Вы действительно хотите удалить счёт?")) {
			Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
				if (response && response.success) {
					this.clear();
					App.updateWidgets();
					App.updateForms();
				}
			});
		}
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */

	removeTransaction(id) {
		if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
			Transaction.remove({ id }, (err, response) => {
				if (response && response.success) {
					this.update();
					App.updateWidgets();
				}
			});
		}
	}

	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (!options) return;

		this.lastOptions = options;

		Account.get(options.account_id, (err, response) => {
			if (response && response.success) {
				this.renderTitle(response.data.name);
			}
		});

		Transaction.list(options, (err, response) => {
			if (response && response.success) {
				this.renderTransactions(response.data);
			}
		});
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([]);
		this.renderTitle("Название счёта");
		this.lastOptions = null;
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(name) {
		const titleElement = this.element.querySelector(".content-title");
		if (titleElement) {
			titleElement.textContent = name;
		}
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
		const dateObj = new Date(date);
		const options = { year: "numeric", month: "long", day: "numeric" };
		const timeOptions = { hour: "2-digit", minute: "2-digit" };
		return `${dateObj.toLocaleDateString(
			"ru-RU",
			options
		)} в ${dateObj.toLocaleTimeString("ru-RU", timeOptions)}`;
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		const transactionType =
			item.type === "income" ? "transaction_income" : "transaction_expense";
		const formattedDate = this.formatDate(item.created_at);

		return `
			<div class="transaction ${transactionType} row">
				<div class="col-md-7 transaction__details">
					<div class="transaction__icon">
						<span class="fa fa-money fa-2x"></span>
					</div>
					<div class="transaction__info">
						<h4 class="transaction__title">${item.name}</h4>
						<div class="transaction__date">${formattedDate}</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="transaction__summ">
						${item.sum} <span class="currency">₽</span>
					</div>
				</div>
				<div class="col-md-2 transaction__controls">
					<button class="btn btn-danger transaction__remove" data-id="${item.id}">
						<i class="fa fa-trash"></i>
					</button>
				</div>
			</div>
		`;
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(data) {
		const contentElement = this.element.querySelector(".content");
		if (contentElement) {
			contentElement.innerHTML = data
				.map(this.getTransactionHTML.bind(this))
				.join("");
		}
	}
}
