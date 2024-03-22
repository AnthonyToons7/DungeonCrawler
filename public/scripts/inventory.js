class Item {
    constructor(name, imgSrc, category) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.category = category;
    }
};

class Inventory {
    constructor() {
        this.weaponryItems = [];
        this.armorItems = [];
        this.generalItems = [];
        this.lists = [
            this.weaponryItems,
            this.armorItems,
            this.generalItems
        ];
        this.categories = ["weapons", "armor", "general"];
    }

    createInventory() {
        this.remove();
        this.inventoryElement = document.createElement('div');
        this.inventoryElement.id = 'inventory';
        this.inventoryElement.classList.add('popUp');
        this.inventoryElement.style.display = 'none';

        const bottomDiv = document.querySelector('#inventory .bottom');

        for (let i = 0; i < this.categories.length; i++) {
            const name = this.categories[i];
            const container = document.createElement("div");
            const title = document.createElement("h2");
            const list = document.createElement("div");

            for (let j = 0; j < this.lists[i].length; j++) {
                const item = this.lists[i][j];
                const itemContainer = document.createElement("div");
                const itemImg = document.createElement("img");
                const itemName = document.createElement("p");

                itemContainer.classList.add("inventory-item");
                itemName.textContent = item.name;
                // itemImg.src = item.imgSrc;

                itemContainer.append(itemImg, itemName);
                list.appendChild(itemContainer);
            }

            container.classList.add(name);
            list.classList.add("category-list");
            title.textContent = name;

            container.append(title, list);
            bottomDiv.appendChild(container);
        }
    }
    remove(){
        const bottomDiv = document.querySelector('#inventory .bottom');
        bottomDiv.innerHTML = '';
    }
}