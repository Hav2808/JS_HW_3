// Good - класс для хранения данных о товаре со свойствами:
class Good {
    constructor(id, name, description, sizes, price, available) {
        // Код товара
        this.id = id;
        // Наименование
        this.name = name;
        // Описание
        this.description = description;
        // массив возможных размеров
        this.sizes = sizes;
        // цена товара
        this.price = price;
        // Признак доступности для продажи
        this.available = available;
    }
    // изменение признака доступности для продажи
    setAvailable(status) {
        this.available = status;
    }
}

// GoodsList - класс для хранения каталога товаров со свойствами:
class GoodsList {
    #goods;
    constructor(filter, sortPrice, sortDir) {
        // массив экземпляров объектов класса Good (приватное поле)
        this.#goods = [];
        // регулярное выражение используемое для фильтрации товаров по полю name
        this.filter = filter;
        // булево значение, признак включения сортировки по полю Price
        this.sortPrice = sortPrice;
        // булево значение, признак направления сортировки по полю Price (true - по возрастанию, false - по убыванию)
        this.sortDir = sortDir;
    }
    // возвращает массив доступных для продажи товаров в соответствии с установленным фильтром и сортировкой по полю Price
    get list() {
        const forSaleList = this.#goods.filter(good => this.filter.test(good.name));
        console.log(forSaleList);
        
        if (!this.sortPrice) {
            return forSaleList.slice(); 
        }

        if (this.sortDir) {
            return forSaleList.slice().sort((a, b) => a.price - b.price);
        }
        return forSaleList.slice().sort((a, b) => b.price - a.price);
    }

    //добавление товара в каталог
    add(newGood) {
        this.#goods.push(newGood);
    }

    // удаление товара из каталога по его id
    remove(id) {
        const getIndex = this.#goods.findIndex(good => good.id === id);

        if (getIndex !== -1) {
            this.#goods.splice(getIndex, 1);
        }

        return getIndex;
    }
}

// BasketGood - класс дочерний от Good, для хранения данных о товаре в корзине с дополнительным свойством:
class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}

// Basket - класс для хранения данных о корзине товаров со свойствами:
class Basket {
    constructor() {
        this.goods = []
    }
    
    get totalAmount() {
        return this.goods.map(item => item.amount).reduce((a, b) => a + b, 0)
    }

    get totalSum() {
        return this.goods.reduce((a, b) => a + b.amount * b.price, 0);
    }

    add(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            this.goods[index].amount += amount;
        } else {
            let addGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(addGood);
        }
    }

    remove(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            if (this.goods[index].amount - amount <= 0 || amount === 0) {
                this.goods.splice(index, 1);
            } else {
                this.goods[index].amount -= amount;
            }
        } 
    }

    clear() {
        this.goods.length = 0;
    }

    removeUnavailable() {
        this.goods.filter(item => item.available === false).forEach(value => this.remove(value));
    }

}


const first = new Good(1, "T-shirt", "color: white, material: coton", ["S", "M", "XL"], 1500, false);
const second = new Good(2, "Dress", "color: red, material: silk", ["S", "M", "L"], 10000, true);
const third = new Good(3, "Jacket", "color: black, material: leather", ["XS", "M", "XXL"], 35000, true);
const fourth = new Good(4, "Jeans", "color: blue, material: coton", ["S", "M", "L", "XL"], 5000, true);
const fifth = new Good(5, "Jeans", "color: grey, material: coton", ["L", "XL"], 4500, true);

second.setAvailable(false);


console.log(third);

const catalog = new GoodsList(/Jeans/i, true, false);

//const catalog = new GoodsList();
catalog.add(first);
console.log(catalog);
catalog.add(second);
catalog.add(third);
catalog.add(fourth);
catalog.add(fifth);

console.log(`Выбор товара из каталога: `, catalog.list);

catalog.sortPrice = true;
catalog.sortDir = true;

console.log(`Сортировка по цене в каталоге: `, catalog.list);

catalog.remove(4);
console.log(`Каталог после удаления товара:`, catalog.list);

const basket = new Basket();

basket.add(first, 1);
basket.add(second, 2);
basket.add(third, 3);
basket.add(fourth, 4);
basket.add(fifth, 5);

console.log(`Товаров в корзине: ${basket.totalAmount}`);
console.log(`Общая сумма ${basket.totalAmount} товаров в корзине: $${basket.totalSum}`);

// Изменение (удаление) количества товаров из корзины
basket.remove(second, 1);
basket.remove(third, 2);

console.log(basket.goods);

basket.removeUnavailable();

console.log(basket.goods)

// Очищение корзины

basket.clear();

console.log(basket.goods);

