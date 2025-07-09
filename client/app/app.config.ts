export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'lavender-haze',
      neutral: 'stone',
    },
    dropdownMenu: {
      slots: {
        content: 'ring ring-gray-200',
        group: 'p-0',
        separator: 'bg-primary',
      },
      variants: {
        color: { primary: { content: 'ring ring-primary' } },
        active: { false: { item: '' } },
      },
    },
  },
})
