let user = new LogoutButton ();
user.action = () => ApiConnector.logout((callback) => {if (callback.success) { location.reload();}});

ApiConnector.current((callback) => {if (callback.success) { return ProfileWidget.showProfile(callback.data)}});

let currencyRate = new RatesBoard();
let gettingRequestCurrencyRate = () => {
    ApiConnector.getStocks((callback) => {if (callback.success) {currencyRate.clearTable(); currencyRate.fillTable(callback.data)}});
};
gettingRequestCurrencyRate();
let timerCurrencyRate = setInterval(gettingRequestCurrencyRate, 60000); 

let money = new MoneyManager();
let balanceReplenishment = (data) => {
    let message;
    if (data.success) {
        ProfileWidget.showProfile(data.data);
        message = 'Баланс успеншно пополнен';
    }  else {
        message = 'Ошибка пополнения баланса';
    }
    money.setMessage(data.success, message);
};
money.addMoneyCallback = (data) => ApiConnector.addMoney(data, ((callback) => balanceReplenishment(callback)));
money.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, ((callback) => balanceReplenishment(callback)));
money.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, ((callback) => balanceReplenishment(callback)));

let favorites = new FavoritesWidget();
let requestUser = (data) => {
    if (data.success) {
        favorites.clearTable();
        favorites.fillTable(data.data);
        money.updateUsersList(data.data);
    };
};
ApiConnector.getFavorites((callback) => requestUser(callback));
let addingUser = (data) => {
    let message;
    if (data.success) {
        requestUser(data);
        message = 'Пользователь успешно добавлен';
    } else {
        message = 'Ошибка добавления пользователя';
    }
    favorites.setMessage(data.success, message);
}
favorites.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, ((callback) => addingUser(callback)));
let deletingUser = (data) => {
    if (data.success) {
        requestUser(data);
        favorites.setMessage(data.success, 'Пользователь успешно удален');
    }    
}
favorites.removeUserCallback = (id) => ApiConnector.removeUserFromFavorites(id, ((callback) => deletingUser(callback)));