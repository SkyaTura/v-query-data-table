import FuzzySearch from 'fuzzy-search'

const db = [
  {
    name: 'Frozen Yogurt',
    calories: 200,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: '1%',
  },
  {
    name: 'Ice cream sandwich',
    calories: 200,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: '1%',
  },
  {
    name: 'Eclair',
    calories: 300,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: '7%',
  },
  {
    name: 'Cupcake',
    calories: 300,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8%',
  },
  {
    name: 'Gingerbread',
    calories: 400,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: '16%',
  },
  {
    name: 'Jelly bean',
    calories: 400,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: '0%',
  },
  {
    name: 'Lollipop',
    calories: 400,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2%',
  },
  {
    name: 'Honeycomb',
    calories: 400,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45%',
  },
  {
    name: 'Donut',
    calories: 500,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: '22%',
  },
  {
    name: 'KitKat',
    calories: 500,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: '6%',
  },
]

const searcher = new FuzzySearch(db, ['name'])

export default payload =>
  new Promise(resolve => {
    const {
      sortBy = [],
      sortDesc = [],
      page = 1,
      itemsPerPage = 10,
      search = '',
    } = payload

    let items = JSON.parse(JSON.stringify(searcher.search(search)))

    if (sortBy.length === 1 && sortDesc.length === 1) {
      items = items.sort((a, b) => {
        const sortA = a[sortBy[0]]
        const sortB = b[sortBy[0]]

        if (sortDesc[0]) {
          if (sortA < sortB) return 1
          if (sortA > sortB) return -1
          return 0
        } else {
          if (sortA < sortB) return -1
          if (sortA > sortB) return 1
          return 0
        }
      })
    }
    const total = items.length

    if (itemsPerPage > 0) {
      items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    }

    setTimeout(() => {
      resolve({
        items,
        total,
        collectionCount: db.length,
      })
    }, Math.random() * 3)
  })
