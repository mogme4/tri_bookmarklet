//<script>
class TabPanel {

    ul;

    /**
     * 選択されたアイテムの変更時のイベント
     * @returns なし
     */
    onSelectedItemChanged;

    #itemMap;
    #selectedItem = null;
    /**
     * タブアイテムの選択
     * 選択前のタブアイテムとコンテントの要素からselectedクラスを外し、選択されたアイテムはselectedクラスを付加する
     */
    get selectedItem() { return this.#selectedItem }
    set selectedItem(item) {
        
        const prevSelectedItem = this.#selectedItem;

        if(Object.is(prevSelectedItem, item)) return;

        if(prevSelectedItem) {

            prevSelectedItem.li.classList.remove("selected");
            prevSelectedItem.content.classList.remove("selected");
            prevSelectedItem._selected = false;

            Util.log(`change ${this.ul.id} previous: ${prevSelectedItem.li.textContent}`);
        }

        item.li.classList.add("selected");
        item.content.classList.add("selected");
        item._selected = true;

        this.#selectedItem = item;

        Util.log(`change ${this.ul.id} current: ${item.li.textContent}`);

        this.onSelectedItemChanged?.();
    }

    /**
     * コンストラクタ
     * @param {string} id - ULエレメントのID 
     */
    constructor(id) {

        Object.defineProperties(this, {
            ul: {value: document.getElementById(id), configurable: false, writable: false},
        });

        this.#itemMap = new Map();
    }

    /**
     * アイテムの追加
     * @param {object} item - アイテムオブジェクトを指定。
     * <設定プロパティ一覧>
     * {string} caption - アイテムのタイトル
     * {HTMLElement} content - アイテムに関連付けられたコンテント要素
     * {boolean} selected - 選択状態にする場合true。最初に追加されたアイテムは選択状態になる。
     * <予約プロパティ一覧>
     * {HTMLElement} li - リスト要素
     * 上記のプロパティはアイテム追加後に読み取り専用プロパティとして参照可能。
     * @returns TabPanelのインスタンス
     */
    addItem(item) {
        
        const li = document.createElement("LI");

        Object.defineProperties(item, {
            caption: {value: item.caption, enumerable: true, configurable: false, writable: false},
            content: {value: item.content, enumerable: true, configurable: false, writable: false},
            li: {value: li, enumerable: true, configurable: false, writable: false},
            _selected: {value: item.selected, enumerable: false, configurable: false, writable: true},
            selected: {get: () => {return item._selected}, enumerable: true, configurable: false}
		});

        li.textContent = item.caption;
        li.addEventListener("click", e => { this.selectedItem = item; });
        this.ul.appendChild(li);
        this.#itemMap.set(item.content, item);

        if(this.selectedItem == null || item.selected) {
            this.selectedItem = item;
        }

        return this;
    }

    /**
     * アイテムオブジェクトの取得
     * @param {HTMLElement} content - アイテムに関連付けられたコンテント要素
     * @returns アイテムオブジェクトを返す
     */
    getItem(content) {

        return this.#itemMap.get(content);
    }
}
