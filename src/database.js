class DBHandler {
  db

  constructor(database) {
    this.db = database
  }

  async getValue(key) {
    const transaction = this.db.transaction(['images'])
    const objectStore = transaction.objectStore('images')
    const request = objectStore.get(key)

    return new Promise((res, rej) => {
      request.onerror = (event) => {
        console.error('Error pulling value for:', key, event)
        rej(null)
      }

      request.onsuccess = () => {
        res(request.result)
      }
    })
  }

  async insertValue(object) {
    const transaction = this.db.transaction(['images'], 'readwrite')
    const objectStore = transaction.objectStore('images')
    const request = objectStore.add(object)

    return new Promise((res) => {
      request.onsuccess = () => {
        res(true)
      }

      request.onerror = (event) => {
        console.error('Error inserting', event)
        res(false)
      }
    })
  }

  async removeValue(key) {
    const transaction = this.db.transaction(['images'], 'readwrite')
    const objectStore = transaction.objectStore('images')
    const request = objectStore.delete(key)

    return new Promise((res) => {
      request.onsuccess = () => {
        res(true)
      }

      request.onerror = () => {
        res(false)
      }
    })
  }

  async getAll() {
    const transaction = this.db.transaction(['images'])
    const objectStore = transaction.objectStore('images')
    const request = objectStore.getAll()

    return new Promise((res, rej) => {
      request.onsuccess = () => {
        res(request.result)
      }

      request.onerror = (e) => {
        rej(e)
      }
    })
  }
}

/**
 *
 * @returns {Promise<DBHandler | null>}
 */
const createDatabase = async (startingData = []) => {
  const request = indexedDB.open('MyTestDatabase')

  return new Promise((res, rej) => {
    request.onerror = () => {
      console.error("Why didn't you allow my web app to use IndexedDB?!")
      rej(null)
    }

    request.onsuccess = (event) => {
      console.log('loaded db')
      const db = event.target.result
      res(new DBHandler(db))
    }

    request.onupgradeneeded = (event) => {
      console.log('create/upgrade')
      const db = event.target.result
      const objectStore = db.createObjectStore('images', {
        keyPath: 'id',
        autoIncrement: true
      })

      objectStore.createIndex('id', 'id', { unique: true })

      objectStore.transaction.oncomplete = () => {
        // initialize starting data
        if (startingData.length !== 0) {
          const imageObjectStore = db
            .transaction('images', 'readwrite')
            .objectStore('images')
          startingData.forEach((image) => {
            imageObjectStore.add(image)
          })
        }

        res(new DBHandler(db))
      }
    }
  })
}

class DBInstance {
  static instance

  static async loadInstance(startingData = []) {
    const i = await createDatabase(startingData)
    DBInstance.instance = i
  }

  static getInstance() {
    if (!DBInstance.instance) {
      console.error('you must first load the instance via: loadInstance()')
      return
    }

    return DBHandler.instance
  }
}

const database = await createDatabase()
export default database
export { DBInstance }
