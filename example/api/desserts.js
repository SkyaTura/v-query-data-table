import FuzzySearch from 'fuzzy-search'

const db = [
  {
    name: 'Frozen Yogurt',
    calories: 200,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: '1%',
    kind: 'cold',
  },
  {
    name: 'Ice cream sandwich',
    calories: 200,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: '1%',
    kind: 'cold',
  },
  {
    name: 'Eclair',
    calories: 300,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: '7%',
    kind: 'cold',
  },
  {
    name: 'Cupcake',
    calories: 300,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8%',
    kind: 'room_temperature',
  },
  {
    name: 'Gingerbread',
    calories: 400,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: '16%',
    kind: 'hot',
  },
  {
    name: 'Jelly bean',
    calories: 400,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: '0%',
    kind: 'room_temperature',
  },
  {
    name: 'Lollipop',
    calories: 400,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2%',
    kind: 'room_temperature',
  },
  {
    name: 'Honeycomb',
    calories: 400,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45%',
    kind: 'room_temperature',
  },
  {
    name: 'Donut',
    calories: 500,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: '22%',
    kind: 'hot',
  },
  {
    name: 'KitKat',
    calories: 500,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: '6%',
    kind: 'room_temperature',
  },
]

const searcher = new FuzzySearch(db, ['name'])

export default payload =>
  new Promise(resolve => {
    const {
      sortBy = [],
      sortDesc = [],
      filter = '',
      getFilterList = '',
      page = 1,
      itemsPerPage = 10,
      search = '',
    } = payload

    if (getFilterList) {
      const data = db
        .map(item => item[getFilterList])
        .reduce(
          (acc, value, index, self) =>
            self.indexOf(value) !== index
              ? acc
              : [
                  ...acc,
                  {
                    value,
                    count: self.filter(item => item === value).length,
                  },
                ],
          []
        )
      setTimeout(() => {
        resolve({
          data,
          totalCount: data.length,
          resultCount: data.length,
        })
      }, Math.random() * 300)
      return
    }

    const filterParams = Object.entries(
      filter
        .split(',')
        .filter(item => item !== '')
        .map(item => item.replace(')', '').split('('))
        .reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: [...(acc[key] || []), value?.toString()],
          }),
          {}
        )
    )
    let items = JSON.parse(
      JSON.stringify(searcher.search(search))
    ).filter(item =>
      filterParams.every(([key, values]) =>
        values.includes(item[key]?.toString())
      )
    )

    if (sortBy.length === 1 && sortDesc.length === 1) {
      items = items.sort((a, b) => {
        const sortA = a[sortBy[0]]
        const sortB = b[sortBy[0]]

        if (sortDesc[0]) {
          if (sortA < sortB) return 1
          if (sortA > sortB) return -1
          return 0
        }
        if (sortA < sortB) return -1
        if (sortA > sortB) return 1
        return 0
      })
    }
    const total = items.length

    if (itemsPerPage > 0) {
      items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    }

    setTimeout(() => {
      resolve({
        data: items,
        resultCount: items.length,
        totalCount: db.length,
      })
    }, Math.random() * 300)
  })
