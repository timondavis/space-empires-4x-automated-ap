export class StorageService {

    static _instance = null;

    /**
     * Get the StorageService instance.
     *
     * @returns {StorageService}
     */
    static getInstance = () => {
        if ( ! this._instance ) {
            this._instance = new StorageService();
        }

        return this._instance;
    }

    storeData = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));

    getData = (key) => JSON.parse(window.localStorage.getItem(key));

    clearData = (key) => window.localStorage.removeItem(key);
}