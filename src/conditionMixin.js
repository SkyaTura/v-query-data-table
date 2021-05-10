export default {
  methods: {
    condition(action) {
      if (action.condition) return action.condition()
      return true
    },
  },
}
